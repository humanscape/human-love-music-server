# human-love-music-server

휴먼들을 위한 음악 공유 어플리케이션. 휴뮤 🧑‍🤝‍🧑❤️🎶

- [클라이언트](https://github.com/humanscape/human-love-music-client)
- [서버](https://github.com/humanscape/human-love-music-server)

## 개발환경 구성

### 1. node 14 버전을 설치해주세요.

> 14.17.6 버전에서 동작이 확인되었습니다

### 2. 의존성을 설치합니다.

```
yarn install
```

### 3. 환경 변수를 설정합니다.

`.env.sample` 파일을 보고 새로운 파일을 작성합니다.

- `.env`: 로컬 환경
- `.env.production`: 운영 환경

```
PORT= # 앱이 실행될 포트
AUTH_JWT_SECRET= # (현재 사용되지 않습니다)

# DB 연결 정보
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

# 슬랙 봇 설정 페이지에서 찾을 수 있습니다
SLACK_SIGNING_SECRET= # Basic Information - App Credentials - Signing Secret
SLACK_BOT_TOKEN= # OAuth & Permissions - Bot User OAuth Token

# 슬랙 봇이 처리할 대상 채널 ID. 채널 우클릭 - Open channel details - 하단에서 확인 가능합니다.
SLACK_DIGEST_TARGET_CHANNEL= # digest를 생성할 때 메시지를 수집할 대상 채널
SLACK_QUEUE_ALLOW_CHANNEL= # 라디오 곡 추가 메시지를 수신할 채널

YOUTUBE_API_KEY= # Google API 콘솔을 통해 발급
SOUNDCLOUD_API_KEY= # SoundCloud 웹에서 아무 리퀘스트 후 url의 query params로 지정된 `client_id`를 지정합니다
```

### 4. 초기 DB와 데이터를 준비합니다.

DB 커넥션 정보가 올바른지 확인한 후 아래 커맨드를 실행하여 테이블을 생성합니다.

```
npx mikro-orm schema:update --run
```

라디오 기능 작동에 필요한 초기 데이터를 직접 생성합니다. (아직 시딩 메서드를 제공하고 있지 않습니다.)

```
> insert into playlist

id, created_at, updated_at, playlist_type, title, description
PJTHllahrNXiNQF, <현재시각>, <현재시각>, RADIO, Radio, <null>

> insert into radio

id, room_name, playlist_id, current_track_id, current_track_started_at, current_track_duration
ToOE5kKoO3XC8m0, main, PJTHllahrNXiNQF, <null>, <null>, <null>
```

### 5. 앱을 실행시킵니다.

```
yarn start

# 혹은 watch mode
yarn start:dev
```

## 빌드와 배포

`yarn build`로 실행하고 `yarn start:prod`로 빌드된 파일을 실행합니다.

> 위 커맨드로 앱 실행시 .env.production 파일을 환경변수로 사용합니다.

배포와 관련된 내용은 현재 변동 가능성이 커서 추후에 작성합니다.
