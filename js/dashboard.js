/* ============================================================
 *  대시보드 페이지 스크립트 (dashboard.html)
 *  - 페이지 라우터 · 사이드바(접기/모바일 드로어) · 다크 모드
 *  - 유저 메뉴 · 언어 전환(i18n: 텍스트 워커 + placeholder + MutationObserver)
 *  - 라이브 수업 : 타이머 · 실시간 자막 · 툴 패널 · 판서 캔버스 · 상태 머신
 *  - 다시보기 · 용어집 · 학생 관리 · 공용 드롭다운
 * ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ══════════════════════════════════════════════
   *  1. i18n — 한국어 원문 → [en, ja, zh-Hans, zh-Hant]
   * ══════════════════════════════════════════════ */
  var LANG_NAMES = ['한국어', 'English', '日本語', '简体中文', '繁體中文'];
  var LANG_CODE = { '한국어': 'ko', 'English': 'en', '日本語': 'ja', '简体中文': 'zh-Hans', '繁體中文': 'zh-Hant' };
  var LANG_IDX = { ko: -1, en: 0, ja: 1, 'zh-Hans': 2, 'zh-Hant': 3 };

  var I18N = {
    /* ── 사이드바 · 공통 메뉴 ── */
    '홈': ['Home', 'ホーム', '首页', '首頁'], '내 교실': ['My Class', 'マイクラス', '我的班级', '我的班級'], '이동 수업': ['Visiting Class', '移動授業', '巡课', '巡課'], '수업 다시보기': ['Class Replay', '授業リプレイ', '课程回放', '課程回放'], '수업자료': ['Materials', '授業資料', '课程资料', '課程資料'], '학생 관리': ['Students', '生徒管理', '学生管理', '學生管理'], '공지사항': ['Notices', 'お知らせ', '公告', '公告'], '환경 설정': ['Settings', '設定', '设置', '設定'], '사용 가이드': ['User Guide', '使い方ガイド', '使用指南', '使用指南'], '용어집': ['Glossary', '用語集', '术语表', '術語表'],
    /* ── 톱바 · 유저 메뉴 ── */
    '선생님 화면': ['Teacher View', '教師画面', '教师界面', '教師介面'], '수업·학생·자료 검색': ['Search classes, students, materials', '授業・生徒・資料を検索', '搜索课程·学生·资料', '搜尋課程·學生·資料'], '김민정 선생님': ['Ms. Kim Minjeong', 'キム・ミンジョン先生', '金玟廷老师', '金玟廷老師'], '1학년 1반 담임': ['Homeroom · G1 Class 1', '1年1組担任', '一年一班班主任', '一年一班班主任'], '담임': ['Homeroom', '担任', '班主任', '班主任'], '내 정보 수정': ['Edit My Info', '情報を編集', '编辑我的信息', '編輯我的資訊'], '화면 모드': ['Display Mode', '表示モード', '显示模式', '顯示模式'], '라이트': ['Light', 'ライト', '浅色', '淺色'], '언어': ['Language', '言語', '语言', '語言'], '로그아웃': ['Log out', 'ログアウト', '退出登录', '登出'],
    /* ── 홈 · 히어로 ── */
    '안녕하세요 김민정 선생님 👋': ['Hello, Ms. Kim Minjeong 👋', 'こんにちは、キム・ミンジョン先生 👋', '您好，金玟廷老师 👋', '您好，金玟廷老師 👋'], '오늘 수업': ['Classes today', '本日の授業', '今日课程', '今日課程'], '· 총 학생': ['· Total students', '· 生徒数', '· 学生总数', '· 學生總數'], '· 오늘도 즐거운 수업을 시작해 보세요.': ['· Have a great class today.', '· 今日も楽しい授業を始めましょう。', '· 开始今天愉快的课程吧。', '· 開始今天愉快的課程吧。'], '수업 시작': ['Start Class', '授業開始', '开始上课', '開始上課'], '2025.07.23 (수)': ['Wed, Jul 23, 2025', '2025年7月23日(水)', '2025年7月23日 周三', '2025年7月23日 週三'], '1교시': ['Period 1', '1限', '第1节', '第1節'], '2교시': ['Period 2', '2限', '第2节', '第2節'], '3교시': ['Period 3', '3限', '第3节', '第3節'], '4교시': ['Period 4', '4限', '第4节', '第4節'], '5교시': ['Period 5', '5限', '第5节', '第5節'], '6교시': ['Period 6', '6限', '第6节', '第6節'], '7/21 (월)': ['Mon 7/21', '7/21(月)', '7/21(周一)', '7/21(週一)'], '7/22 (화)': ['Tue 7/22', '7/22(火)', '7/22(周二)', '7/22(週二)'], '7/23 (수)': ['Wed 7/23', '7/23(水)', '7/23(周三)', '7/23(週三)'], '4건': ['4 items', '4件', '4条', '4條'], '1건': ['1 item', '1件', '1条', '1條'], '2건': ['2 items', '2件', '2条', '2條'], '3건': ['3 items', '3件', '3条', '3條'], '5건': ['5 items', '5件', '5条', '5條'], '카메라 없이 수업을 시작했습니다. 아래 [비디오 시작]으로 다시 켤 수 있습니다.': ['Class started without a camera. You can turn it back on with [Start Video] below.', 'カメラなしで授業を開始しました。下の[ビデオ開始]で再度オンにできます。', '已在无摄像头的情况下开始上课。可通过下方[开启视频]重新开启。', '已在無攝影機的情況下開始上課。可透過下方[開啟視訊]重新開啟。'], '3개': ['3 classes', '3コマ', '3节课', '3節課'], '28명': ['28 students', '28名', '28名', '28名'], '명': ['', '名', '名', '名'], '개': ['', 'コマ', '节', '節'],
    /* ── 홈 · 기능 카드 ── */
    '내 수업': ['My Class', '私の授業', '我的课程', '我的課程'], '1학년 1반': ['Grade 1 Class 1', '1年1組', '一年一班', '一年一班'], '중국어(간체)': ['Chinese (Simplified)', '中国語(簡体)', '中文(简体)', '中文(簡體)'], '학생 수': ['Students', '生徒数', '学生数', '學生數'], '교실 입장': ['Enter Class', '教室に入る', '进入教室', '進入教室'], '중요': ['Important', '重要', '重要', '重要'], '다른 반에 입장해 수업을 진행할 수 있어요': ['Join another class to teach', '他のクラスに入って授業できます', '可进入其他班级授课', '可進入其他班級授課'], '1학년 2반': ['G1 Class 2', '1年2組', '一年二班', '一年二班'], '1학년 3반': ['G1 Class 3', '1年3組', '一年三班', '一年三班'], '2학년 1반': ['G2 Class 1', '2年1組', '二年一班', '二年一班'], '2학년 2반': ['G2 Class 2', '2年2組', '二年二班', '二年二班'], '이동 수업 입장': ['Enter Visiting Class', '移動授業に入る', '进入巡课', '進入巡課'], '날짜·교시별로 수업 영상을 다시 볼 수 있어요': ['Rewatch by date and period', '日付・時限ごとに再視聴', '按日期·课时回看', '按日期·課時回看'], '다시보기 열기': ['Open Replay', 'リプレイを開く', '打开回放', '開啟回放'], '수업 자료를 업로드하고 학생과 공유하세요': ['Upload and share materials', '資料をアップロードして共有', '上传并与学生共享', '上傳並與學生共享'], '동영상': ['Video', '動画', '视频', '影片'], '기타': ['Other', 'その他', '其他', '其他'], '자료 관리': ['Manage Materials', '資料管理', '管理资料', '管理資料'],
    /* ── 홈 · 오늘의 수업 ── */
    '오늘의 수업': ["Today's Schedule", '本日の授業', '今日课程', '今日課程'], '교시': ['Period', '時限', '课时', '課時'], '시간': ['Time', '時間', '时间', '時間'], '수업 주제': ['Topic', 'トピック', '主题', '主題'], '상태': ['Status', '状態', '状态', '狀態'], '작업': ['Action', '操作', '操作', '操作'], '자기소개 표현 익히기': ['Learn self-introduction phrases', '自己紹介の表現を学ぶ', '学习自我介绍表达', '學習自我介紹表達'], '예정': ['Scheduled', '予定', '计划', '計劃'], '시작': ['Start', '開始', '开始', '開始'], '가족 소개하기': ['Introduce your family', '家族を紹介する', '介绍家人', '介紹家人'], '진행 전': ['Pending', '開始前', '未开始', '未開始'], '수업중': ['In Class', '授業中', '上课中', '上課中'], '인사말 배우기': ['Learn greetings', 'あいさつを学ぶ', '学习问候语', '學習問候語'], '숫자와 시간 표현': ['Numbers & time', '数と時間の表現', '数字与时间表达', '數字與時間表達'], '일상 대화 연습': ['Everyday conversation practice', '日常会話の練習', '日常对话练习', '日常對話練習'], '전체 시간표 보기': ['View full timetable', '全時間割を見る', '查看完整课表', '查看完整課表'],
    /* ── 홈 · 빠른 실행 ── */
    '빠른 실행': ['Quick Actions', 'クイック操作', '快捷操作', '快捷操作'], '마이크 테스트': ['Mic Test', 'マイクテスト', '麦克风测试', '麥克風測試'], '학생 발표': ['Student Present', '生徒発表', '学生发言', '學生發言'], '자막 언어': ['Caption Lang', '字幕言語', '字幕语言', '字幕語言'], '다크모드': ['Dark Mode', 'ダークモード', '深色模式', '深色模式'],
    /* ── 홈 · 최근 활동 · 푸터 ── */
    '최근 활동': ['Recent Activity', '最近の活動', '最近动态', '最近動態'], '더보기': ['More', 'もっと見る', '更多', '更多'], "수업자료 '가족소개_표현.pdf' 업로드": ["Uploaded 'family_intro.pdf'", '資料「家族紹介.pdf」をアップロード', '上传‘家庭介绍.pdf’', '上傳「家庭介紹.pdf」'], '1학년 1반 2교시 수업 영상이 준비되었습니다.': ['Grade 1 Class 1 Period 2 video is ready.', '1年1組2限の授業動画が準備できました。', '一年一班第2节课程视频已就绪。', '一年一班第2節課程影片已就緒。'], '김민수 학생이 번역 요청을 보냈습니다.': ['Kim Minsu sent a translation request.', 'キム・ミンス生徒が翻訳リクエストを送信しました。', '学生金敏洙发送了翻译请求。', '學生金敏洙發送了翻譯請求。'], '오늘 09:15': ['Today 09:15', '本日 09:15', '今天 09:15', '今天 09:15'], '어제 14:42': ['Yesterday 14:42', '昨日 14:42', '昨天 14:42', '昨天 14:42'], '어제 11:08': ['Yesterday 11:08', '昨日 11:08', '昨天 11:08', '昨天 11:08'], '© 2025 군서미래국제학교 · 누리 NURI': ['© 2025 Gunseo Future Intl. School · NURI', '© 2025 グンソ未来国際学校 · NURI', '© 2025 群西未来国际学校 · NURI', '© 2025 群西未來國際學校 · NURI'],
    /* ── 학생 관리 ── */
    '담당 학급 학생을 추가하고 이름·모국어(자막 언어)를 관리합니다.': ['Add students and manage names & native language (caption language).', '生徒を追加し、名前・母語(字幕言語)を管理します。', '添加学生并管理姓名·母语(字幕语言)。', '新增學生並管理姓名·母語(字幕語言)。'], '학생 7명': ['7 Students', '生徒7名', '7名学生', '7名學生'], '학생 추가': ['Add Student', '生徒を追加', '添加学生', '新增學生'], '아이디는 학년·반·순번으로 자동 발급됩니다 (수정 불가)': ['ID is auto-issued by grade/class/number (not editable)', 'IDは学年・組・番号で自動発行(編集不可)', '学号按年级·班级·序号自动发放(不可修改)', '學號按年級·班級·序號自動發放(不可修改)'], '발급 아이디': ['Issued ID', '発行ID', '发放学号', '發放學號'], '모국어(필수)': ['Native Lang (required)', '母語(必須)', '母语(必填)', '母語(必填)'], '추가': ['Add', '追加', '添加', '新增'], '이름': ['Name', '名前', '姓名', '姓名'], '비번': ['Password', 'パスワード', '密码', '密碼'], '비활성': ['Deactivate', '無効化', '停用', '停用'], '활성화': ['Activate', '有効化', '启用', '啟用'], '영어': ['English', '英語', '英语', '英語'], '베트남어': ['Vietnamese', 'ベトナム語', '越南语', '越南語'], '일본어': ['Japanese', '日本語', '日语', '日語'], '태국어': ['Thai', 'タイ語', '泰语', '泰語'], '한국어': ['Korean', '韓国語', '韩语', '韓語'], '중국어(번체)': ['Chinese (Traditional)', '中国語(繁体)', '中文(繁体)', '中文(繁體)'], '러시아어': ['Russian', 'ロシア語', '俄语', '俄語'], '우즈베크어': ['Uzbek', 'ウズベク語', '乌兹别克语', '烏茲別克語'], '크메르어': ['Khmer', 'クメール語', '高棉语', '高棉語'], '몽골어': ['Mongolian', 'モンゴル語', '蒙古语', '蒙古語'], '타갈로그어': ['Tagalog', 'タガログ語', '他加禄语', '他加祿語'], '미국학생': ['American Student', 'アメリカ人生徒', '美国学生', '美國學生'], '중국학생': ['Chinese Student', '中国人生徒', '中国学生', '中國學生'], '필리핀학생': ['Filipino Student', 'フィリピン人生徒', '菲律宾学生', '菲律賓學生'], '테스트학생': ['Test Student', 'テスト生徒', '测试学生', '測試學生'],
    /* ── 다시보기 ── */
    '날짜·교시별로 수업 영상과 자막을 다시 볼 수 있습니다.': ['Rewatch class videos and captions by date/period.', '日付・時限ごとに動画と字幕を再視聴できます。', '按日期·课时回看视频与字幕。', '按日期·課時回看影片與字幕。'], '원문': ['Original', '原文', '原文', '原文'], 'AI 요약': ['AI Summary', 'AI要約', 'AI摘要', 'AI摘要'], '전체 녹화': ['All recordings', '全録画', '全部录像', '全部錄影'], '35건': ['35 items', '35件', '35条', '35條'], '녹화': ['Recordings', '録画', '录像', '錄影'], '1학년 1반 · 2026-07-23': ['G1 Class 1 · 2026-07-23', '1年1組 · 2026-07-23', '一年一班 · 2026-07-23', '一年一班 · 2026-07-23'], '녹화된 수업': ['Recorded Classes', '録画授業', '已录课程', '已錄課程'], '1학년 1반 수업': ['G1 Class 1 Lesson', '1年1組の授業', '一年一班课程', '一年一班課程'], '자막': ['Captions', '字幕', '字幕', '字幕'], '강의 요약': ['Summary', '講義要約', '讲课摘要', '講課摘要'], '선생님': ['Teacher', '先生', '老师', '老師'], '안녕하세요, 오늘 수업을 시작하겠습니다.': ["Hello, let's begin today's class.", 'こんにちは、本日の授業を始めます。', '大家好，现在开始今天的课。', '大家好，現在開始今天的課。'], '오늘은 광합성의 원리를 배워봅시다.': ["Today let's learn the principle of photosynthesis.", '今日は光合成の原理を学びましょう。', '今天我们学习光合作用的原理。', '今天我們學習光合作用的原理。'], '교과서 32페이지를 펴 주세요.': ['Open your textbook to page 32.', '教科書32ページを開いてください。', '请翻开课本第32页。', '請翻開課本第32頁。'], '먼저 지난 시간 내용을 복습할게요.': ["First, let's review last time.", 'まず前回の内容を復習します。', '先复习上节课内容。', '先複習上節課內容。'], '엽록체가 빛을 흡수하는 과정을 볼까요?': ["Let's see how chloroplasts absorb light.", '葉緑体が光を吸収する過程を見ましょう。', '我们来看叶绿体吸收光的过程。', '我們來看葉綠體吸收光的過程。'], '광합성의 기본 원리와 엽록소의 역할을 중심으로 진행되었습니다.': ['Focused on photosynthesis basics and the role of chlorophyll.', '光合成の基本原理と葉緑素の役割を中心に進めました。', '围绕光合作用基本原理与叶绿素作用展开。', '圍繞光合作用基本原理與葉綠素作用展開。'], '교과서 32페이지 도식을 함께 살펴보며 명반응·암반응을 설명했습니다.': ['Used the page-32 diagram to explain light/dark reactions.', '教科書32ページの図を見ながら明反応・暗反応を説明。', '结合课本第32页图解讲解明反应·暗反应。', '結合課本第32頁圖解講解明反應·暗反應。'], '다음 차시에는 호흡과의 비교 실험을 예고했습니다.': ['Previewed a comparison experiment with respiration next time.', '次回は呼吸との比較実験を予告。', '预告下节课与呼吸的比较实验。', '預告下節課與呼吸的比較實驗。'], '요약 다시 생성': ['Regenerate Summary', '要約を再生成', '重新生成摘要', '重新生成摘要'],
    /* ── 용어집 ── */
    '교과 전문용어의 번역을 지정하면, 수업 자막에서 그대로 번역됩니다.': ['Define subject-term translations to apply them in captions.', '専門用語の訳を指定すると字幕にそのまま反映されます。', '指定学科术语译文后即用于字幕。', '指定學科術語譯文後即用於字幕。'], '용어 추가': ['Add Term', '用語を追加', '添加术语', '新增術語'], '범위': ['Scope', '範囲', '范围', '範圍'], '번역': ['Translation', '翻訳', '翻译', '翻譯'], '분류': ['Category', '分類', '分类', '分類'], '광합성': ['Photosynthesis', '光合成', '光合作用', '光合作用'], '전역': ['Global', '全体', '全局', '全域'], '· 중국어': ['· Chinese', '· 中国語', '· 中文', '· 中文'], '· 일본어': ['· Japanese', '· 日本語', '· 日语', '· 日語'], '· 베트남어': ['· Vietnamese', '· ベトナム語', '· 越南语', '· 越南語'], '과학': ['Science', '理科', '科学', '科學'], '수정': ['Edit', '編集', '编辑', '編輯'], '삭제': ['Delete', '削除', '删除', '刪除'], '엽록체': ['Chloroplast', '葉緑体', '叶绿体', '葉綠體'], '이 학급': ['This class', 'このクラス', '本班', '本班'], '명반응': ['Light reaction', '明反応', '明反应', '明反應'], '원문 용어 (한국어)': ['Source term (Korean)', '原語(韓国語)', '原文术语(韩语)', '原文術語(韓語)'], '분류 (과목)': ['Category (subject)', '分類(科目)', '分类(科目)', '分類(科目)'], '적용 범위': ['Apply scope', '適用範囲', '应用范围', '應用範圍'], '전역 (모든 수업)': ['Global (all classes)', '全体(全授業)', '全局(所有课程)', '全域(所有課程)'], '이 학급만': ['This class only', 'このクラスのみ', '仅本班', '僅本班'], '언어별 번역': ['Translations by language', '言語別翻訳', '各语言翻译', '各語言翻譯'], '취소': ['Cancel', 'キャンセル', '取消', '取消'], '저장': ['Save', '保存', '保存', '儲存'], '이 용어를 삭제할까요?': ['Delete this term?', 'この用語を削除しますか？', '删除此术语？', '刪除此術語？'], '용어를 삭제하면 복구할 수 없으며,': ['Deleting a term is irreversible,', '用語を削除すると復元できず、', '删除后无法恢复，', '刪除後無法復原，'], '수업 자막 번역에서도 제외됩니다.': ["and it's removed from caption translation.", '字幕翻訳からも除外されます。', '并将从字幕翻译中移除。', '並將從字幕翻譯中移除。'],
    /* ── 라이브 수업 ── */
    '수업 종료': ['End Class', '授業終了', '结束上课', '結束上課'], '나가기': ['Leave', '退出', '离开', '離開'], '카메라 꺼짐': ['Camera Off', 'カメラオフ', '摄像头关闭', '攝影機關閉'], '음소거': ['Mute', 'ミュート', '静音', '靜音'], '비디오 중지': ['Stop Video', 'ビデオ停止', '停止视频', '停止視訊'], '음소거 해제': ['Unmute', 'ミュート解除', '取消静音', '取消靜音'], '비디오 시작': ['Start Video', 'ビデオ開始', '开启视频', '開啟視訊'], '자료 공유': ['Share', '資料共有', '共享资料', '共享資料'], '판서': ['Draw', '板書', '板书', '板書'], '참여자': ['Participants', '参加者', '参与者', '參與者'], '학생에게 전송할 창을 선택하세요': ['Choose a window to send to students', '生徒に送る画面を選択', '选择要发送给学生的窗口', '選擇要傳送給學生的視窗'], '전체 화면': ['Full Screen', '全画面', '全屏', '全螢幕'], '이 창 공유하기': ['Share this window', 'この画面を共有', '共享此窗口', '共享此視窗'], '펜': ['Pen', 'ペン', '钢笔', '鋼筆'], '연필': ['Pencil', '鉛筆', '铅笔', '鉛筆'], '마커': ['Marker', 'マーカー', '马克笔', '麥克筆'], '형광펜': ['Highlighter', '蛍光ペン', '荧光笔', '螢光筆'], '참여자 0명': ['0 Participants', '参加者0名', '0名参与者', '0名參與者'], '아직 입장한 학생이 없습니다': ['No students have joined yet', 'まだ入室した生徒はいません', '尚无学生进入', '尚無學生進入'], '언어 설정': ['Language Settings', '言語設定', '语言设置', '語言設定'], '내 발화 언어 (음성 인식)': ['My speaking language (STT)', '自分の発話言語(音声認識)', '我的讲话语言(语音识别)', '我的講話語言(語音辨識)'], '자동 감지': ['Auto-detect', '自動検出', '自动检测', '自動偵測'], '자막 번역 언어': ['Caption translation languages', '字幕翻訳言語', '字幕翻译语言', '字幕翻譯語言'], '학생 등록 언어에 따라 자동 설정됩니다': ["Set automatically by students' registered languages", '生徒の登録言語に応じて自動設定', '按学生注册语言自动设置', '按學生註冊語言自動設定'], '실시간 자막': ['Live Captions', 'リアルタイム字幕', '实时字幕', '即時字幕'], '수업을 시작하면 음성이 자막으로 변환됩니다': ['Speech becomes captions once class starts', '授業を始めると音声が字幕になります', '上课后语音将转为字幕', '上課後語音將轉為字幕'], '이름 수정': ['Edit Name', '名前を編集', '编辑姓名', '編輯姓名'],
    /* ── 준비 중 ── */
    '준비 중인 화면입니다': ['This screen is coming soon', '準備中の画面です', '此页面正在筹备中', '此頁面正在籌備中'], '이 메뉴는 곧 대시보드 안에서 제공될 예정이에요.': ['This menu will be available in the dashboard soon.', 'このメニューは近日中にダッシュボードで提供予定です。', '该菜单即将在仪表盘中提供。', '該選單即將在儀表板中提供。'],
    /* ── placeholder ── */
    '@ph:비밀번호': ['Password', 'パスワード', '密码', '密碼'], '@ph:이름': ['Name', '名前', '姓名', '姓名'], '@ph:예: 광합성': ['e.g. Photosynthesis', '例: 光合成', '例：光合作用', '例：光合作用'], '@ph:예: 과학': ['e.g. Science', '例: 理科', '例：科学', '例：科學'], '@ph:번역어 입력': ['Enter translation', '訳語を入力', '输入译文', '輸入譯文'], '@ph:새 이름': ['New name', '新しい名前', '新姓名', '新姓名']
  };

  var currentLang = '한국어';

  /* 언어 적용: <html lang> 변경(폰트는 CSS 자동 전환) + 텍스트노드 워커 + placeholder */
  function applyLang(name) {
    currentLang = name;
    var code = LANG_CODE[name] || 'ko';
    var i = LANG_IDX[code];

    document.documentElement.lang = code;

    (function walk(node) {
      for (var c = node.firstChild; c; c = c.nextSibling) {
        if (c.nodeType === 3) {
          // 빈 번역('명'→'')으로 공백만 남은 노드도 __ko 캐시가 있으면 복원한다
          if (c.__ko === undefined) {
            if (!c.nodeValue.trim()) continue;
            c.__ko = c.nodeValue;
          }
          var raw = c.__ko;
          if (i < 0) { c.nodeValue = raw; continue; }
          var core = raw.trim();
          var tr = I18N[core];
          if (tr && tr[i] !== undefined) {
            var lead = raw.match(/^\s*/)[0];
            var trail = raw.match(/\s*$/)[0];
            c.nodeValue = lead + tr[i] + trail;
          } else {
            c.nodeValue = raw;
          }
        } else if (c.nodeType === 1) {
          var t = c.tagName;
          if (t === 'SCRIPT' || t === 'STYLE') continue;
          if (c.classList && c.classList.contains('msr')) continue;
          walk(c);
        }
      }
    })(document.body);

    $$('[placeholder]').forEach(function (el) {
      if (el.__phk === undefined) el.__phk = el.getAttribute('placeholder');
      var core = el.__phk;
      if (i < 0) { el.setAttribute('placeholder', core); return; }
      var tr = I18N['@ph:' + core];
      if (tr && tr[i] !== undefined) el.setAttribute('placeholder', tr[i]);
    });
  }

  /* 동적으로 추가된 노드(자막 행·버튼 라벨 등)도 즉시 번역 */
  try {
    new MutationObserver(function (ms) {
      if ((LANG_CODE[currentLang] || 'ko') === 'ko') return;
      for (var k = 0; k < ms.length; k++) {
        if (ms[k].addedNodes && ms[k].addedNodes.length) {
          applyLang(currentLang);
          break;
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) { /* 미지원 환경 무시 */ }

  /* ══════════════════════════════════════════════
   *  2. 라우터
   * ══════════════════════════════════════════════ */
  var pages = {};
  $$('.dash-page').forEach(function (p) { pages[p.getAttribute('data-page')] = p; });

  function route(id) {
    if (!pages[id]) id = 'soon'; // 없는 페이지는 '준비 중'으로
    Object.keys(pages).forEach(function (k) {
      pages[k].classList.toggle('is-active', k === id);
    });
  }

  /* ══════════════════════════════════════════════
   *  3. 사이드바 — 접기 · 모바일 드로어
   * ══════════════════════════════════════════════ */
  var aside = $('[data-sidebar]');
  var toggleBtn = $('[data-toggle-sidebar]');
  var backdrop = $('[data-sb-backdrop]');
  var collapsed = false;

  function setCollapsed(c) {
    collapsed = c;
    if (aside) aside.classList.toggle('is-collapsed', c);
  }

  function closeDrawer() {
    if (aside) aside.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (window.innerWidth <= 780) {
        // 모바일: 오버레이 드로어 토글
        if (!aside) return;
        if (aside.classList.contains('is-open')) {
          closeDrawer();
        } else {
          if (collapsed) setCollapsed(false);
          aside.classList.add('is-open');
          if (backdrop) backdrop.classList.add('is-visible');
        }
        return;
      }
      setCollapsed(!collapsed);
    });
  }

  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  /* 사이드바 내비게이션: 활성 표시 + 모바일 드로어 닫기 */
  var navItems = $$('.sidebar__nav .sidebar__item');
  navItems.forEach(function (it) {
    it.addEventListener('click', function () {
      navItems.forEach(function (o) { o.classList.toggle('is-active', o === it); });
      if (window.innerWidth <= 780) closeDrawer();
    });
  });

  /* ══════════════════════════════════════════════
   *  4. 사이드바 언어 드롭다운 (위로 펼침)
   * ══════════════════════════════════════════════ */
  var sbLang = $('[data-sb-lang]');
  var sbLangLabel = $('[data-sb-lang-label]');
  var sbLangMenu = $('[data-sb-lang-menu]');

  if (sbLang && sbLangMenu) {
    sbLang.addEventListener('click', function (e) {
      e.stopPropagation();
      if (collapsed) { setCollapsed(false); return; }
      sbLangMenu.classList.toggle('is-open');
    });
    $$('[data-lang-name]', sbLangMenu).forEach(function (o) {
      o.addEventListener('click', function (e) {
        e.stopPropagation();
        var name = o.getAttribute('data-lang-name');
        if (sbLangLabel) sbLangLabel.textContent = name;
        sbLangMenu.classList.remove('is-open');
        applyLang(name);
      });
    });
    document.addEventListener('click', function () { sbLangMenu.classList.remove('is-open'); });
  }

  /* ══════════════════════════════════════════════
   *  5. 다크 모드 — <html data-theme="dark"> 토글
   * ══════════════════════════════════════════════ */
  var themeBtn = $('[data-theme-toggle]');

  function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeBtn) {
      var ic = themeBtn.querySelector('.msr');
      if (ic) ic.textContent = dark ? 'light_mode' : 'dark_mode';
    }
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () { setTheme(!isDark()); });
  }

  /* ══════════════════════════════════════════════
   *  6. 유저 메뉴 팝업
   * ══════════════════════════════════════════════ */
  var um = $('[data-usermenu]');
  if (um) {
    var pop = um.querySelector('[data-usermenu-pop]');
    um.addEventListener('click', function (e) {
      e.stopPropagation();
      pop.classList.toggle('is-open');
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    $$('[data-goto], [data-logout]', pop).forEach(function (x) {
      x.addEventListener('click', function () { pop.classList.remove('is-open'); });
    });
    document.addEventListener('click', function () { pop.classList.remove('is-open'); });

    /* 메뉴 안 언어 순환 */
    var umLang = um.querySelector('[data-um-lang]');
    var umLangVal = um.querySelector('[data-um-langval]');
    if (umLang && umLangVal) {
      var umLangIdx = 0;
      umLang.addEventListener('click', function (e) {
        e.stopPropagation();
        umLangIdx = (LANG_NAMES.indexOf(currentLang) + 1) % LANG_NAMES.length;
        var nl = LANG_NAMES[umLangIdx];
        umLangVal.textContent = nl;
        applyLang(nl);
      });
    }
  }

  /* 로그아웃 → 로그인 페이지 */
  var logoutBtn = $('[data-logout]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () { location.href = 'index.html'; });
  }

  /* ══════════════════════════════════════════════
   *  7. 단일 선택 그룹 (data-choice: 반 타일·날짜·교시 칩)
   * ══════════════════════════════════════════════ */
  $$('[data-choice]').forEach(function (g) {
    var items = Array.prototype.slice.call(g.children);
    items.forEach(function (it) {
      it.addEventListener('click', function () {
        items.forEach(function (o) { o.classList.toggle('is-active', o === it); });
      });
    });
  });

  /* ══════════════════════════════════════════════
   *  8. 라이브 수업
   * ══════════════════════════════════════════════ */
  var liveStart = function () {};
  var liveStop = function () {};
  var lp = pages['live'];

  if (lp) {
    var lq = function (s) { return $$(s, lp); };
    var l1 = function (s) { return $(s, lp); };

    var timerEl = l1('[data-timer]');
    var capCount = l1('[data-capcount]');
    var capBody = l1('[data-capbody]');
    var capEmpty = l1('[data-cap-empty]');

    /* ── 타이머 + 자막 샘플 타임라인 ── */
    var lvTimer = null;
    var lvT = 0;
    var lvCts = [];
    var lvLang = 'ko';
    var CL = { ko: 1, en: 2, zh: 3 };
    var samples = [
      ['00:03', '안녕하세요, 오늘 수업을 시작하겠습니다.', "Hello, let's begin today's lesson.", '大家好，今天开始上课。'],
      ['00:11', '오늘은 광합성의 원리를 배워봅시다.', "Today, let's learn the principles of photosynthesis.", '今天我们来学习光合作用的原理。'],
      ['00:19', '교과서 32페이지를 펴 주세요.', 'Please open your textbook to page 32.', '请翻到课本第32页。'],
      ['00:27', '먼저 지난 시간 내용을 복습할게요.', "First, let's review the last lesson.", '首先，我们来复习上节课的内容。']
    ];

    var fmt = function (s) {
      return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    };

    /* 자막 행 추가 (첫 행은 강조, 중국어는 .font-zh-hans 폰트) */
    var addCap = function (i) {
      var s = samples[i];
      var row = document.createElement('div');
      row.className = 'dash-caprow' + (i === 0 ? ' is-hl' : '');
      row.setAttribute('data-caprow', '');
      row.setAttribute('data-idx', i);
      row.innerHTML =
        '<span class="dash-caprow__time">' + s[0] + '</span>' +
        '<div><div class="dash-caprow__who">선생님</div>' +
        '<div class="dash-caprow__text' + (lvLang === 'zh' ? ' font-zh-hans' : '') + '" data-captx>' + s[CL[lvLang]] + '</div></div>';
      capBody.appendChild(row);
      if (capCount) capCount.textContent = capBody.querySelectorAll('[data-caprow]').length + '건';
    };

    liveStart = function () {
      if (lvTimer) return;
      lvT = 0;
      if (timerEl) timerEl.textContent = '00:00';
      lvTimer = setInterval(function () {
        lvT++;
        if (timerEl) timerEl.textContent = fmt(lvT);
      }, 1000);
      $$('[data-caprow]', capBody).forEach(function (e) { e.remove(); });
      if (capEmpty) capEmpty.classList.add('is-hidden');
      samples.forEach(function (s, i) {
        lvCts.push(setTimeout(function () { addCap(i); }, (i + 1) * 1600));
      });
    };

    liveStop = function () {
      clearInterval(lvTimer);
      lvTimer = null;
      lvCts.forEach(clearTimeout);
      lvCts = [];
      if (timerEl) timerEl.textContent = '00:00';
      $$('[data-caprow]', capBody).forEach(function (e) { e.remove(); });
      if (capEmpty) capEmpty.classList.remove('is-hidden');
      if (capCount) capCount.textContent = '0건';
    };

    /* ── 툴 패널 열고닫기 + 위치 계산 ── */
    var panels = {};
    lq('[data-panel]').forEach(function (p) { panels[p.getAttribute('data-panel')] = p; });
    var toolBtns = lq('[data-tool]');

    /* ── 판서 캔버스 ── */
    var penColor = '#ef4444';
    var penW = 3;
    var penAlpha = 1;
    var stageBox = l1('[data-stagebox]');
    var drawCanvas = null;
    var syncDrawCanvas = function () {};

    if (stageBox) {
      drawCanvas = document.createElement('canvas');
      drawCanvas.className = 'dash-drawcanvas';
      stageBox.appendChild(drawCanvas);
      var dctx = drawCanvas.getContext('2d');

      // 크기 동기화 (리사이즈 시 재계산)
      var rz = function () {
        var r = drawCanvas.getBoundingClientRect();
        if (r.width && (drawCanvas.width !== Math.round(r.width) || drawCanvas.height !== Math.round(r.height))) {
          drawCanvas.width = Math.round(r.width);
          drawCanvas.height = Math.round(r.height);
        }
      };
      rz();
      window.addEventListener('resize', rz);

      var drawing = false;
      var hist = [];
      var P = function (e) {
        var r = drawCanvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
      };

      drawCanvas.addEventListener('pointerdown', function (e) {
        drawing = true;
        try {
          hist.push(dctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
          if (hist.length > 40) hist.shift();
        } catch (err) { /* 무시 */ }
        var q = P(e);
        dctx.beginPath();
        dctx.moveTo(q[0], q[1]);
        try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
      });
      drawCanvas.addEventListener('pointermove', function (e) {
        if (!drawing) return;
        var q = P(e);
        dctx.globalAlpha = penAlpha;
        dctx.strokeStyle = penColor;
        dctx.lineWidth = penW;
        dctx.lineCap = 'round';
        dctx.lineJoin = 'round';
        dctx.lineTo(q[0], q[1]);
        dctx.stroke();
      });
      var up = function () { drawing = false; };
      drawCanvas.addEventListener('pointerup', up);
      drawCanvas.addEventListener('pointerleave', up);

      var undoBtn = l1('[data-undo]');
      if (undoBtn) {
        undoBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (hist.length) dctx.putImageData(hist.pop(), 0, 0);
        });
      }
      var clearBtn = l1('[data-clear]');
      if (clearBtn) {
        clearBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          hist = [];
        });
      }

      // 판서 패널이 열려 있을 때만 캔버스가 포인터를 받는다
      syncDrawCanvas = function () {
        var open = panels.draw && panels.draw.classList.contains('is-open');
        if (open) rz();
        drawCanvas.classList.toggle('is-drawing', !!open);
      };
    }

    var setTool = function (it, on) {
      it.classList.toggle('is-on', on);
    };

    var closeAll = function (except) {
      Object.keys(panels).forEach(function (k) {
        if (k !== except) panels[k].classList.remove('is-open');
      });
      toolBtns.forEach(function (b) {
        if (b.getAttribute('data-tool') !== except) setTool(b, false);
      });
      syncDrawCanvas();
    };

    /* 툴 버튼 기준으로 패널을 수평 중앙 정렬 (동적 위치는 인라인) */
    var positionPanel = function (it, p) {
      var parent = p.offsetParent;
      if (!parent) return;
      var pr = parent.getBoundingClientRect();
      var br = it.getBoundingClientRect();
      var left = br.left + br.width / 2 - pr.left - p.offsetWidth / 2;
      left = Math.max(8, Math.min(left, pr.width - p.offsetWidth - 8));
      p.style.left = left + 'px';
      p.style.right = 'auto';
      p.style.transform = 'none';
      p.style.bottom = (pr.bottom - br.top + 14) + 'px';
    };

    toolBtns.forEach(function (it) {
      var key = it.getAttribute('data-tool');
      it.addEventListener('click', function (e) {
        e.stopPropagation();
        var p = panels[key];
        if (!p) return;
        var open = p.classList.contains('is-open');
        closeAll(open ? null : key);
        p.classList.toggle('is-open', !open);
        setTool(it, !open);
        if (!open) positionPanel(it, p);
        syncDrawCanvas();
      });
    });

    lq('[data-close]').forEach(function (c) {
      c.addEventListener('click', function (e) {
        e.stopPropagation();
        var k = c.getAttribute('data-close');
        if (panels[k]) {
          panels[k].classList.remove('is-open');
          toolBtns.forEach(function (b) {
            if (b.getAttribute('data-tool') === k) setTool(b, false);
          });
          syncDrawCanvas();
        }
      });
    });

    Object.keys(panels).forEach(function (k) {
      panels[k].addEventListener('click', function (e) { e.stopPropagation(); });
    });
    document.addEventListener('click', function () { closeAll(null); });

    /* ── 펜 종류 · 색상 ── */
    lq('[data-pen]').forEach(function (p) {
      p.addEventListener('click', function () {
        lq('[data-pen]').forEach(function (x) { x.classList.toggle('is-active', x === p); });
        var kind = p.getAttribute('data-pen');
        penAlpha = kind === 'highlight' ? 0.35 : 1;
        penW = kind === 'highlight' ? 14 : kind === 'marker' ? 7 : kind === 'pencil' ? 2 : 3;
      });
    });

    lq('[data-color]').forEach(function (c) {
      c.addEventListener('click', function () {
        lq('[data-color]').forEach(function (x) { x.classList.toggle('is-active', x === c); });
        penColor = c.getAttribute('data-color') || penColor;
      });
    });

    /* ── 언어 설정: 발화 언어(단일) · 자막 번역 언어(다중) ── */
    lq('[data-splang] [data-opt]').forEach(function (o) {
      o.addEventListener('click', function () {
        lq('[data-splang] [data-opt]').forEach(function (x) { x.classList.toggle('is-active', x === o); });
      });
    });

    lq('[data-sublang] [data-opt]').forEach(function (o) {
      o.addEventListener('click', function () {
        var on = o.getAttribute('data-on') === '1';
        o.setAttribute('data-on', on ? '0' : '1');
        o.classList.toggle('is-active', !on);
      });
    });

    /* ── 공유 창 선택 ── */
    lq('[data-win]').forEach(function (w) {
      w.addEventListener('click', function () {
        lq('[data-win]').forEach(function (x) { x.classList.toggle('is-active', x === w); });
      });
    });

    /* ── 마이크 · 카메라 토글 ── */
    lq('[data-av]').forEach(function (b) {
      var ic = b.querySelector('.msr');
      var label = b.querySelector('.dash-tool__label');
      var kind = b.getAttribute('data-av');
      var cfg = kind === 'mic'
        ? { on: ['mic', '음소거'], off: ['mic_off', '음소거 해제'] }
        : { on: ['videocam', '비디오 중지'], off: ['videocam_off', '비디오 시작'] };
      b.addEventListener('click', function () {
        var off = b.getAttribute('data-state') === 'off';
        b.setAttribute('data-state', off ? 'on' : 'off');
        var c = off ? cfg.on : cfg.off;
        ic.textContent = c[0];
        label.textContent = c[1];
        b.classList.toggle('is-off', !off);
      });
    });

    /* ── 자막 언어 세그먼트 (원문/영어/中文) ── */
    var capbar = l1('[data-capbar]');
    if (capbar) {
      var cls = $$('[data-cl]', capbar);
      cls.forEach(function (b) {
        b.addEventListener('click', function () {
          lvLang = b.getAttribute('data-cl');
          cls.forEach(function (x) { x.classList.toggle('is-active', x === b); });
          $$('[data-caprow]', capBody).forEach(function (r) {
            var idx = +r.getAttribute('data-idx');
            var tx = r.querySelector('[data-captx]');
            if (tx) {
              tx.textContent = samples[idx][CL[lvLang]];
              tx.classList.toggle('font-zh-hans', lvLang === 'zh');
            }
          });
        });
      });
    }
  }

  /* ══════════════════════════════════════════════
   *  9. 라이브 상태 머신 (pre → run → end)
   * ══════════════════════════════════════════════ */
  var lstart = $('[data-live-start]');
  var lexit = $('[data-live-exit]');
  var lleave = $('[data-live-leave]');
  var lrec = $('[data-rec-badge]');

  function liveState(s) {
    if (lstart) lstart.classList.toggle('is-hidden', s !== 'pre');
    if (lexit) {
      lexit.classList.toggle('is-hidden', s === 'pre');
      lexit.classList.toggle('is-disabled', s === 'end');
    }
    if (lleave) lleave.classList.toggle('is-hidden', s === 'run');
    if (lrec) lrec.classList.toggle('is-on', s === 'run');
  }
  liveState('pre');

  if (lstart) {
    lstart.addEventListener('click', function () {
      liveStart();
      liveState('run');
    });
  }
  if (lexit) {
    lexit.addEventListener('click', function () {
      liveStop();
      liveState('end');
    });
  }
  if (lleave) {
    lleave.addEventListener('click', function () {
      liveStop();
      liveState('pre');
      route('home');
      setCollapsed(false);
      navItems.forEach(function (o, i) { o.classList.toggle('is-active', i === 0); });
    });
  }

  /* ══════════════════════════════════════════════
   *  10. 공용 라우팅 — data-goto · data-startclass · 빠른 실행
   * ══════════════════════════════════════════════ */
  $$('[data-goto]').forEach(function (b) {
    b.addEventListener('click', function () {
      route(b.getAttribute('data-goto'));
      setCollapsed(false);
    });
  });

  /* 교실 입장(라이브 진입): 사이드바는 접고 상태를 초기화 */
  function enterLive() {
    route('live');
    setCollapsed(true);
    liveState('pre');
  }

  $$('[data-startclass]').forEach(function (b) {
    b.addEventListener('click', enterLive);
  });

  /* 홈 퀵타일: 라이브 진입 또는 다크 모드 토글 */
  $$('[data-quick]').forEach(function (t) {
    t.addEventListener('click', function () {
      if (t.getAttribute('data-quick') === 'theme') setTheme(!isDark());
      else enterLive();
    });
  });

  /* ══════════════════════════════════════════════
   *  11. 다시보기 — 탭 · 언어 · 녹화/시크 목록
   * ══════════════════════════════════════════════ */
  var rp = pages['replay'];
  if (rp) {
    var rq = function (s) { return $$(s, rp); };

    /* 탭 (자막 / 강의 요약) */
    var rtabs = rq('[data-rtab]');
    var rpanes = { cap: $('[data-rpane="cap"]', rp), sum: $('[data-rpane="sum"]', rp), rec: $('[data-rpane="rec"]', rp) };
    rtabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-rtab');
        rtabs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
        Object.keys(rpanes).forEach(function (pk) {
          if (rpanes[pk]) rpanes[pk].classList.toggle('is-active', pk === k);
        });
      });
    });

    /* 언어 전환 (원문/영어) — data-cap의 data-ko/en/zh 사용 */
    var rlangs = rq('[data-rlang]');
    rlangs.forEach(function (t) {
      t.addEventListener('click', function () {
        rlangs.forEach(function (x) { x.classList.toggle('is-active', x === t); });
        var key = t.getAttribute('data-rlang');
        rq('[data-cap]').forEach(function (c) {
          var v = c.getAttribute('data-' + key);
          if (v) c.textContent = v;
          c.classList.toggle('font-zh-hans', key === 'zh');
        });
      });
    });

    /* 녹화 목록 선택 */
    var recs = rq('[data-rec]');
    recs.forEach(function (r) {
      r.addEventListener('click', function () {
        recs.forEach(function (x) { x.classList.toggle('is-active', x === r); });
      });
    });

    /* 자막 시크 목록 선택 */
    var seeks = rq('[data-seek]');
    seeks.forEach(function (s) {
      s.addEventListener('click', function () {
        seeks.forEach(function (x) { x.classList.toggle('is-active', x === s); });
      });
    });
  }

  /* ══════════════════════════════════════════════
   *  12. 공용 드롭다운 (data-dd)
   * ══════════════════════════════════════════════ */
  $$('[data-dd]').forEach(function (dd) {
    var btn = $('[data-dd-btn]', dd);
    var menu = $('[data-dd-menu]', dd);
    var label = $('[data-dd-label]', dd);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      $$('[data-dd-menu]').forEach(function (m) {
        if (m !== menu) m.classList.remove('is-open');
      });
      menu.classList.toggle('is-open');
    });
    $$('[data-dd-opt]', menu).forEach(function (o) {
      o.addEventListener('click', function (e) {
        e.stopPropagation();
        label.textContent = o.textContent;
        menu.classList.remove('is-open');
      });
    });
  });
  document.addEventListener('click', function () {
    $$('[data-dd-menu]').forEach(function (m) { m.classList.remove('is-open'); });
  });

  /* ══════════════════════════════════════════════
   *  13. 용어집 — 추가/수정 모달 · 삭제 확인
   * ══════════════════════════════════════════════ */
  var gm = $('[data-glossary-modal]');
  if (gm) {
    var gmOpen = function () { gm.classList.add('is-open'); };
    var gmClose = function () { gm.classList.remove('is-open'); };

    $$('[data-glossary-add], [data-glossary-edit]').forEach(function (b) {
      b.addEventListener('click', gmOpen);
    });
    $$('[data-gm-close]', gm).forEach(function (b) { b.addEventListener('click', gmClose); });
    gm.addEventListener('click', function (e) { if (e.target === gm) gmClose(); });

    /* 적용 범위 세그먼트: '이 학급만' 선택 시 학급 칩 표시 */
    var scopes = $$('[data-gm-scope]', gm);
    var gmClass = $('[data-gm-class]', gm);
    scopes.forEach(function (t, ti) {
      t.addEventListener('click', function () {
        scopes.forEach(function (x) { x.classList.toggle('is-active', x === t); });
        if (gmClass) gmClass.classList.toggle('is-open', ti === 1);
      });
    });
  }

  var gdel = $('[data-gdel-modal]');
  var gpage = pages['glossary'];
  if (gdel && gpage) {
    var gdelTarget = null;
    var gdelName = $('[data-gdel-name]', gdel);
    var gdelClose = function () {
      gdel.classList.remove('is-open');
      gdelTarget = null;
    };

    $$('[data-gdel]', gpage).forEach(function (b) {
      b.addEventListener('click', function () {
        var row = b.closest('.dash-gtable__row');
        gdelTarget = row;
        var term = row ? $('.dash-gtable__term', row) : null;
        if (term && gdelName) {
          gdelName.innerHTML = '<b>' + term.textContent + '</b> 용어를 삭제하면 복구할 수 없으며,<br>수업 자막 번역에서도 제외됩니다.';
        }
        gdel.classList.add('is-open');
      });
    });
    $('[data-gdel-cancel]', gdel).addEventListener('click', gdelClose);
    gdel.addEventListener('click', function (e) { if (e.target === gdel) gdelClose(); });
    $('[data-gdel-confirm]', gdel).addEventListener('click', function () {
      if (gdelTarget) gdelTarget.remove();
      gdelClose();
    });
  }

  /* ══════════════════════════════════════════════
   *  14. 학생 관리 — 언어 셀렉트 · 활성 토글 · 수정 모달
   * ══════════════════════════════════════════════ */
  var LANGS = ['중국어(간체)', '중국어(번체)', '베트남어', '영어', '일본어', '러시아어', '태국어', '우즈베크어', '몽골어', '한국어'];

  /* 언어 셀렉트: 메뉴를 JS로 생성, 뷰포트 기준 상/하·좌/우 위치 결정 */
  $$('[data-langsel]').forEach(function (sel) {
    var label = $('[data-lsel-label]', sel);
    var menu = document.createElement('div');
    menu.className = 'dropdown__menu dash-langsel__menu';
    menu.setAttribute('data-lmenu', '');
    LANGS.forEach(function (l) {
      var o = document.createElement('div');
      o.className = 'dropdown__item';
      o.textContent = l;
      o.addEventListener('click', function (e) {
        e.stopPropagation();
        if (label) {
          label.textContent = l;
          label.classList.remove('is-placeholder');
        }
        menu.classList.remove('is-open');
      });
      menu.appendChild(o);
    });
    sel.appendChild(menu);

    sel.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = menu.classList.contains('is-open');
      $$('[data-lmenu]').forEach(function (m) { m.classList.remove('is-open'); });
      if (wasOpen) return;
      menu.classList.add('is-open');

      // 뷰포트 여백에 따라 위/아래·좌/우 결정 (동적 값은 인라인)
      var r = sel.getBoundingClientRect();
      var mh = Math.min(260, menu.scrollHeight + 2);
      var below = window.innerHeight - r.bottom;
      if (below < mh + 12 && r.top > below) {
        menu.style.top = 'auto';
        menu.style.bottom = 'calc(100% + 6px)';
      } else {
        menu.style.top = 'calc(100% + 6px)';
        menu.style.bottom = 'auto';
      }
      var mw = Math.max(200, sel.offsetWidth);
      if (r.left + mw > window.innerWidth - 8) {
        menu.style.left = 'auto';
        menu.style.right = '0';
      } else {
        menu.style.left = '0';
        menu.style.right = 'auto';
      }
    });
  });
  document.addEventListener('click', function () {
    $$('[data-lmenu]').forEach(function (m) { m.classList.remove('is-open'); });
  });

  /* 활성/비활성 토글 + 행 잠금 */
  $$('[data-active-btn]').forEach(function (b) {
    var row = b.closest('[data-srow]');
    b.addEventListener('click', function () {
      var on = b.getAttribute('data-on') === '1';
      b.setAttribute('data-on', on ? '0' : '1');
      b.textContent = on ? '활성화' : '비활성';
      b.classList.toggle('is-off', on);
      if (row) {
        row.classList.toggle('is-inactive', on);
        row.classList.toggle('is-locked', on);
      }
    });
  });

  /* 잠금 안내 모달 (예정 교시 시작 버튼) */
  var infoModal = $('[data-info-modal]');
  if (infoModal) {
    var infoOpen = function () { infoModal.classList.add('is-open'); };
    var infoClose = function () { infoModal.classList.remove('is-open'); };
    $$('[data-locked]').forEach(function (b) { b.addEventListener('click', infoOpen); });
    $$('[data-info-close]', infoModal).forEach(function (x) { x.addEventListener('click', infoClose); });
    infoModal.addEventListener('click', function (e) { if (e.target === infoModal) infoClose(); });
  }

  /* 이름/비밀번호 수정 모달 */
  var editModal = $('[data-modal]');
  if (editModal) {
    var emTitle = $('[data-modal-title]', editModal);
    var emSub = $('[data-modal-sub]', editModal);
    var emInput = $('[data-modal-input]', editModal);

    $$('[data-edit]').forEach(function (b) {
      b.addEventListener('click', function () {
        var row = b.closest('[data-srow]');
        var nm = row ? row.getAttribute('data-name') : '';
        var id = row ? row.getAttribute('data-id') : '';
        var kind = b.getAttribute('data-edit');
        emTitle.textContent = kind === 'name' ? '이름 수정' : '비밀번호 수정';
        emSub.textContent = '학생: ' + nm + ' (' + id + ')';
        emInput.type = kind === 'name' ? 'text' : 'password';
        emInput.value = '';
        emInput.placeholder = kind === 'name' ? '새 이름' : '새 비밀번호';
        editModal.classList.add('is-open');
        setTimeout(function () {
          try { emInput.focus(); } catch (e) { /* 무시 */ }
        }, 50);
      });
    });
    $$('[data-modal-close]', editModal).forEach(function (c) {
      c.addEventListener('click', function () { editModal.classList.remove('is-open'); });
    });
    editModal.addEventListener('click', function (e) {
      if (e.target === editModal) editModal.classList.remove('is-open');
    });
    var emSave = $('[data-modal-save]', editModal);
    if (emSave) {
      emSave.addEventListener('click', function () { editModal.classList.remove('is-open'); });
    }
  }

  /* ══════════════════════════════════════════════
   *  N. 모바일 아코디언 — [data-acc] 헤더 클릭 시 is-open 토글
   *     · design-system.js 의 data-acc 패턴을 그대로 사용
   *     · 데스크탑(>780px)에서는 CSS가 상세부를 항상 표시하므로
   *       is-open 토글은 시각적으로 무해 (쉐브론도 CSS로 숨김)
   *     · 상세부의 인터랙션 요소(버튼·수정·삭제·언어 셀렉트) 클릭은
   *       각자의 동작만 수행하고 아코디언 토글은 일으키지 않음
   * ══════════════════════════════════════════════ */
  var ACC_SKIP = 'button, a, input, select, [data-edit], [data-active-btn], [data-glossary-edit], [data-gdel], [data-langsel]';
  $$('[data-acc]').forEach(function (head) {
    head.addEventListener('click', function (e) {
      if (e.target.closest(ACC_SKIP)) return;
      head.classList.toggle('is-open');
    });
  });
})();
