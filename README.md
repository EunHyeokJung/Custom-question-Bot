# CustomQuestionBot


 Custom questions ChatBot for MessengerBot R

 Copyright © 2021 EunHyeukJung


 ### KR
 * 이 스크립트는 '메신저봇 R', '채팅 자동응답 봇' 이라는 챗봇 어플리케이션 기준으로 제작되었습니다.
 * 최초로 실행할 경우 다음 경로에 자동으로 파일을 생성합니다. 예시파일도 함께 생성됩니다. (example.txt)
 * 파일경로: sdcard(또는 기본 내장 메모리)/BotData/database/words/
 * 텍스트 에디터를 이용해 위 경로에 txt파일을 추가 또는 수정하여 원하는 질문/정답을 만들 수 있습니다.
 * 질문/정답 텍스트 파일의 구조는 JSON 구조로 작성하세요. 'example.txt' 파일을 참고하시면 됩니다.

#### 변수

|변수이름|타입|설명|예시|
|------|------|-------------|-----------------|
|timeover|Number|테스트 진행시 자동으로 문제를 패스하게 되는 제한시간입니다. (5~25 권장)|15|
|path|String|질문&답변 데이터를 저장하는 기본 저장 경로입니다.|sdcard/BotData/database/단어테스트/|


#### 기본 명령어

|명령어|설명|사용조건|사용예시|
|------|---------------|-----------|---------|
|/불러오기 (파일이름)|저장된 질문/답변 파일을 가져와 적용합니다.|테스트가 진행중이지 않은경우|/불러오기 수특16|
|/셔플|가져온 질문/답변의 순서를 무작위로 섞습니다.|테스트가 진행중이지 않은경우|/셔플|
|/테스트시작|테스트를 시작합니다.|테스트가 진행중이지 않은경우|/테스트시작|
|/예시파일생성|example.txt 예시파일을 강제로 작성합니다.||/예시파일생성|


#### 테스트 진행 명령어

|명령어|설명|사용조건|사용예시|
|------|---------------|-----------|---------|
|(정답)|정답을 그대로 입력합니다. (/ 없이)|테스트가 진행중인 경우|apple|
|/패스|해당 문제를 넘깁니다. (오답처리)|테스트가 진행중인 경우|/패스|
|/포기|테스트를 포기하고 종료합니다. 바로 결과창이 띄워집니다.|테스트가 진행중인 경우|/포기|




 ### EN
 * This script created based on an chatbot application called 'MessengerBot R', '채팅 자동응답 봇'.
 * When run for the first time, the file is automatically created in the following path. Example files are also created. (example.txt)
 * path: sdcard(or default storage)/BotData/database/words/
 * You can create the desired question/answer by adding or modifying the txt file in the above path using a text editor.
 * Write the structure of the question/answer text file in JSON structure. You can refer to file 'example.txt'.


#### Variables

|NAME|TYPE|DES|EXAMPLE|
|------|------|-------------|-----------------|
|timeover|Number|Time limit of test (Second, 5~25 recommanded)|15|
|path|String|default path for load or save a question&answer data.|sdcard/BotData/database/WordTest/|


#### Basic command

|COMMAND|DES|TERMS OF USE|EXAMPLE|
|------|---------------|-----------|---------|
|/불러오기 (FIle name)|Get question&answer file and load.|Only test is not in progress|/불러오기 word16|
|/셔플|Randomly shuffle the order of questions/answers.|Only test is not in progress|/셔플|
|/테스트시작|Begin the test.|Only test is not in progress|/테스트시작|
|/예시파일생성|Write a example.txt file.||/예시파일생성|


#### Test progress command

|COMMAND|DES|TERMS OF USE|EXAMPLE|
|------|---------------|-----------|---------|
|(Answer)|Write a answer of question without slash(/).|Only test is in progress|apple|
|/패스|Pass this question. (Wrong answer increase)|Only test is in progress|/패스|
|/포기|Give up this test and show the result.|Only test is in progress|/포기|


