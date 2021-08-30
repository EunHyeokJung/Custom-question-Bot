/**************************

 Custom questions ChatBot for MessengerBot R

 Copyright © 2021 EunHyeukJung (halfhumun@gmail.com)
 CC-BY-NC


 * KR
 * 이 스크립트는 '메신저봇 R', '채팅 자동응답 봇' 이라는 챗봇 어플리케이션 기준으로 제작되었습니다.
 * 최초로 실행할 경우 다음 경로에 자동으로 파일을 생성합니다. 예시파일도 함께 생성됩니다. (example.txt)
 * 파일경로: sdcard(또는 기본 내장 메모리)/BotData/database/words/
 * 텍스트 에디터를 이용해 위 경로에 txt파일을 추가 또는 수정하여 원하는 질문/정답을 만들 수 있습니다.
 * 질문/정답 텍스트 파일의 구조는 JSON 구조로 작성하세요. 'example.txt' 파일을 참고하시면 됩니다.


 * EN
 * This script created based on an chatbot application called 'MessengerBot R', '채팅 자동응답 봇'.
 * When run for the first time, the file is automatically created in the following path. Example files are also created. (example.txt)
 * path: sdcard(or default storage)/BotData/database/words/
 * You can create the desired question/answer by adding or modifying the txt file in the above path using a text editor.
 * Write the structure of the question/answer text file in JSON structure. You can refer to file 'example.txt'.

 **************************/

const scriptName = "단어";

const example = '{\n"apple":"사과",\n"mouse":"쥐",\n"The name of the President of North Korea in 2021?":"Kim Jongeun"\n}';


//문제 시간제한 (초)
//권장: 5~25
var timeover = 15;

//파일경로
path = "sdcard/BotData/database/words/";


/***
 * Don't touch the variable below
 * 아래 변수는 건드리지 마세요. [건드려서 오류나면 알아서 :)]
 ***/

//
var stdingWrds = null;
var testWrds;

//테스트 진행관련 변수
var testing = false;
var qNo = null;
var q_wrds;

//테스트 결과 산출 변수
var q_total = 0;
var q_pass = 0;
var q_crt = 0;
var q_tmovr = 0;
var failwrd = [];

jFile = java.io.File;
if(!jFile(path).canRead()) {
    FileStream.write(path + "example.txt", example);
}


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    //테스트 진행시 입력
    if (testing) {
        //포기
        if (msg == "/포기") {
            testing = false;
            getResult("gu");
            //패스
        } else if (msg == "/패스") {
            pass();
            //정답 입력
        } else {
            checkAns(msg);
        }
    }

    //테스트 시작 함수
    function begin() {
        testing = true;
        q_wrds = testWrds.map(e => e);
        qNo = 1;
        replier.reply("잠시후 " + q_wrds.length + "개의 단어 테스트를 시작합니다.");
        replier.reply("각 문제당 제한시간은 " + timeover + "초 입니다.\n/패스: 해당 문제를 넘깁니다.\n/포기: 테스트를 즉시 종료합니다.");
        java.lang.Thread.sleep(1000);
        question();
    }

    //테스트 종료, 결과창 반환 함수
    function getResult(rs) {
        if (rs == "gu") q_total--;
        q_wrds = testWrds;
        replier.reply("| 테스트 결과\n총 " + testWrds.length + "문제중 " + q_total + "개의 문제를 풀었습니다.\n정답: " + q_crt + "\n오답: " + (q_total - q_crt) + "\n ㄴ단순오답: " + (q_total - q_crt - q_pass - q_tmovr) + "\n ㄴ패스: " + q_pass + "\n ㄴ제한시간 초과: " + q_tmovr);
        testing = false;
        qNo = null;
        q_total = 0;
        q_pass = 0;
        q_crt = 0;
        q_tmovr = 0;
        replier.reply("| 틀린문제\n" + failwrd.join("\n"));
        replier.reply("다음 테스트 문제가 틀린 문제들로 설정되었습니다.");
        testWrds = failwrd.map(e=>e);
        failwrd = [].map(e=>e);
    }

    //문제 패스 함수
    function pass() {
        replier.reply(qNo + "번 문제를 넘겼습니다.\n정답: " + stdingWrds[q_wrds[0]]);
        failwrd.push(q_wrds[0]);
        //패스한 문제 수 증가
        q_pass++;
        //문제 번호 증가
        qNo++;
        //현재 문제 삭제
        q_wrds.shift();
        //다음문제 호출
        question();
    }

    //남은 문제수와 제한시간체크 & 문제 출력
    function question() {
        if (!testing) return;

        //문제 갯수 남았는지 체크
        if (q_wrds.length > 0) {
            //현재 푼 문제 갯수 증가
            q_total++;
            //문제 제시
            replier.reply(qNo + ". " + q_wrds[0]);
            //현재풀고있는 문제 번호를 새로운 문제번호로 교체
            var nwNo = qNo;
            //시간체크
            java.lang.Thread.sleep(timeover * 1000);

            //시간 지연 이후 진행중인 문제가 같을 때
            if (qNo == nwNo && testing) {
                replier.reply("시간이 초과되었습니다.\n정답: " + stdingWrds[q_wrds[0]]);
                failwrd.push(q_wrds[0]);
                //문제 번호 증가
                qNo++;
                //현재 문제 삭제
                q_wrds.shift();
                //제한시간 초과한 문제 수 증가
                q_tmovr++;
               //재귀
                question();
            }
        } else {
            replier.reply("문제를 모두 풀었습니다.");
            getResult();
            testing = false;
        }
    }

    //문제 정답/오답 분류
    function checkAns(ans) {
        var q_answer;
        //정답이 여러개일 경우 배열로 변환, 판단
        if (stdingWrds[q_wrds[0]].includes(",")) {
            q_answer = stdingWrds[q_wrds[0]].split(",").map(e => e.trim());
        } else {
            q_answer = stdingWrds[q_wrds[0]];
        }
        //정답
        if (q_answer.includes(ans) || q_answer == ans) {
            replier.reply("정답입니다.");
            //정답 갯수 증가
            q_crt++;
            qNo++;
            q_wrds.shift();
            //오답
        } else {
            replier.reply("오답입니다.\n정답: " + q_answer);
            failwrd.push(q_wrds[0]);
            qNo++;
            q_wrds.shift();
        }
        //question 함수 호출
        question();
    }

    //불러오기 기능
    if (msg.startsWith("/불러오기") && !testing) {
        try {
            stdingWrds = FileStream.read(path + msg.substr(5).trim() + ".txt");
            if (stdingWrds != null && stdingWrds != undefined) {
                stdingWrds = JSON.parse(stdingWrds);
                var wrds = [];
                for (var key in stdingWrds) {
                    wrds.push(key + ": " + stdingWrds[key]);
                }
                replier.reply(msg.substr(5).trim() + " 목록의 단어를 불러왔습니다. (" + wrds.length + "개)");
                replier.reply(wrds.join("\n"));
            }
            testWrds = Object.keys(stdingWrds);
        } catch (e) {
            replier.reply("파일이 존재하지 않거나 불러올 수 없는 상태입니다.\n" + e + "(#" + e.lineNumber + ")");
        }
    }

    //셔플 기능
    if (msg.startsWith("/셔플") && !testing) {
        try {
            var objKeys = testWrds.map(e=>e);
            replier.reply(objKeys.length + "개의 단어순서를 섞는중입니다.");
            var cnt = objKeys.length;
            var objWrds = [];
            for (var i = 0; i < cnt; i++) {
                var ran = Math.floor(Math.random() * objKeys.length);
                objWrds.push(objKeys[ran]);
                objKeys.splice(ran, 1);
            }
            testWrds = objWrds.map(e=>e);
            replier.reply(testWrds.join("\n"));
        } catch (e) {
            replier.reply("단어를 섞는중 오류가 발생했습니다.\n" + e + "(#" + e.lineNumber + ")");
        }
    }

    //테스트시작
    if (msg == "/테스트시작") {
        if (testing) {
            replier.reply("이미 테스트가 진행중입니다.");
            return;
        }
        if (testWrds.length == 0) {
            replier.reply("테스트할 단어목록이 없습니다.\n이미 불러온 목록이 있다면 '/셔플'로 테스트할 단어목록을 생성할 수 있습니다.");
            return;
        }
        begin();
    }
    if(msg == "/예시파일생성") {
        FileStream.write(path + "example.txt", example);
        replier.reply(path + "경로에 예시파일을 생성했습니다.");
    }

    if(msg == "/도움말" || msg == "/명령어") {
        replier.reply("[도움말]\n" +
            ">>클릭해 설명을 읽어주세요.\n\n" + "\u200b".repeat(600) +
            "\n\n| 기본기능\n\n" +
            "- /불러오기 (파일이름)\n" +
            " 저장된 질문/답변 파일을 가져옵니다.\n\n" +
            "- /셔플\n" +
            "가져온 질문/답변의 순서를 무작위로 섞습니다.\n\n" +
            "- /테스트시작\n" +
            " 테스트를 시작합니다.\n\n" +
            "- /예시파일생성\n" +
            " example.txt 예시파일을 강제로 작성합니다.\n" +
            "\n\n\n" +
            "| 테스트 진행\n\n" +
            "테스트가 시작되면 정답 또는 다음 명령어 중 하나를 입력할 수 있습니다.\n\n" +
            "- /패스: 해당 문제를 넘깁니다. (오답처리)\n\n" +
            "- /포기: 테스트를 포기하고 종료합니다. 바로 결과창이 띄워집니다.\n" +
            "\n" +
            "테스트에는 각 문제당 시간제한이 존재합니다. 기본 15초로 설정되어 있으며, 스크립트의 33번째 줄에서 수정 가능합니다.\n" +
            "\n\n\n" +
            "| 질문/답변 파일 추가, 수정\n\n" +
            "스크립트 상단부분의 설명에 써있듯, 기본 파일 경로는 정해져있습니다. 해당 경로의 폴더에 파일을 추가하거나 수정하시면 됩니다.\n\n" +
            "최초로 실행시 example.txt 라는 예시 파일을 생성합니다. 파일 생성과 수정이 어려우신분은 이 예시 파일을 복사해 이름만 바꿔 사용하실 수 있습니다.\n\n" +
            "원하는 파일명으로 여러개의 파일을 만들어 원하는 부분만 학습할 수 있습니다.\n\n" +
            "파일명 예시)\n" +
            "  교과서-13   수특-10\n\n" +
            "불러오기 예시)\n" +
            "  /불러오기 교과서-13    /불러오기 수특-10\n\n" +
            "\n\n추가질문 => 댓글 또는 개인채팅");
    }
}
