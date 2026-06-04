/// <reference types="vite/client" />

// 프로젝트 커스텀 env 변수 타입.
interface ImportMetaEnv {
  /** 'true'이면 백엔드 없이 개발용 시드 데이터로 동작 (.env.development) */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
