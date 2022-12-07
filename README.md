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

Node 런타임을 제공하는 환경에 서버를 배포 & 실행시킵니다.
가급적 단일 인스턴스 환경에서 앱을 운용하는 해야 예약 작업 관련 이슈를 최소화시킬 수 있습니다. (ec2 등)

## 트러블 슈팅 & 관리

### 라디오 큐가 꼬인 경우(재생이 멈추거나 다음 곡으로 넘어가지 않음)

- 예약 작업이 setTimeout(인메모리)로 관리되기 때문에 일부 관리형 서비스에 배포 및 운용시, 혹은 다중 인스턴스 환경에서 큐 관리에 실패할 수 있습니다.
- 궁극적으로는 메시지큐 도입을 해야 안정화됩니다.
  - 예약 작업을 지원하고, 딜레이가 적은 것
  - https://github.com/rabbitmq/rabbitmq-delayed-message-exchange 를 괜찮은 후보로 보고 있습니다.
- 현재 상태에서는 다음과 같은 절차로 일시적 해소 가능합니다.
  1. DB에서 radio 테이블에 존재하는 단일 로우의 `current_track_id`, `current_track_started_at`, `current_track_duration`의 값을 모두 `null`로 설정합니다.
  1. 해당 `radio.playlist..tracks`를 모두 제거합니다.
  1. 앱을 재부팅합니다.

### 회사 멤버 변동이 있는 경우

`PUT /slack/members`를 실행하여 `slack_member` 테이블을 업데이트 합니다.
