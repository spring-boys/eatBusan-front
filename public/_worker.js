// Cloudflare Pages 고급 모드 워커 (빌드 시 dist/_worker.js 로 복사됨).
// 역할:
//   - 정적 자산(Vue 빌드 결과)은 Pages가 서빙
//   - /api/*(REST) 와 /ws-stomp(WebSocket, vote 실시간)는 백엔드로 프록시
// 이렇게 하면 브라우저엔 eatbusan.co.kr 한 출처로 보여(same-origin)
// 쿠키 인증·CORS·mixed content 문제가 모두 사라지고, FE 코드도 무수정이다.

const BACKEND_HOST = 'api.eatbusan.co.kr'; // EC2 nginx(server_name api...)로 라우팅됨

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) API(REST) + STOMP(WebSocket) → 백엔드로 프록시
    if (url.pathname.startsWith('/api/') || url.pathname === '/ws-stomp') {
      const target = new URL(request.url);
      target.protocol = 'http:';      // BE는 현재 HTTP only
      target.hostname = BACKEND_HOST; // Host 헤더도 이 값 → nginx server_name 매칭
      target.port = '';
      // 메서드/헤더/바디 + WebSocket 업그레이드를 그대로 전달 (Cloudflare가 WS 패스스루)
      return fetch(new Request(target.toString(), request));
    }

    // 2) 그 외 → 정적 자산
    const res = await env.ASSETS.fetch(request);

    // SPA fallback: 클라이언트 라우팅(/vote/:id 등) 새로고침 시 index.html 반환
    if (res.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }
    return res;
  },
};
