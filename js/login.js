/* ============================================================
 *  로그인 페이지 스크립트
 *  - 언어 전환 (텍스트 번역 + <html lang> 변경 → CSS가 폰트 자동 전환)
 *  - 비밀번호 표시 토글 / 저장 체크박스 / 로그인 이동
 * ============================================================ */
(function () {
  'use strict';

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ── 언어별 문구 (키: data-i18n / data-i18n-ph) ── */
  var I18N = {
    ko: {
      headline: '선생님의 수업을,<br>학생의 언어로.',
      hsub: '국제학교 실시간 번역 수업 시스템',
      title: '로그인', sub: '오늘의 수업이 기다리고 있습니다',
      id: '아이디', idph: '아이디 입력',
      pw: '비밀번호', pwph: '비밀번호 입력',
      save: '아이디·비밀번호 저장', login: '로그인',
      help: '계정이 없으면 담임 선생님 또는 관리자에게 문의하세요',
      iderr: '아이디를 입력하세요', pwerr: '비밀번호를 입력하세요'
    },
    en: {
      headline: "Every lesson, in every student's language.",
      hsub: 'Real-time translated classes for international schools',
      title: 'Log in', sub: 'Your class is waiting for you today',
      id: 'ID', idph: 'Enter your ID',
      pw: 'Password', pwph: 'Enter your password',
      save: 'Save ID & password', login: 'Log in',
      help: 'No account? Please contact your homeroom teacher or admin.',
      iderr: 'Please enter your ID', pwerr: 'Please enter your password'
    },
    ja: {
      headline: '先生の授業を、生徒の言語で。',
      hsub: '国際学校 リアルタイム翻訳授業システム',
      title: 'ログイン', sub: '今日の授業が待っています',
      id: 'ID', idph: 'IDを入力',
      pw: 'パスワード', pwph: 'パスワードを入力',
      save: 'IDとパスワードを保存', login: 'ログイン',
      help: 'アカウントがない場合は担任または管理者にお問い合わせください',
      iderr: 'IDを入力してください', pwerr: 'パスワードを入力してください'
    },
    'zh-Hans': {
      headline: '让老师的课，走进每位学生的语言。',
      hsub: '国际学校实时翻译授课系统',
      title: '登录', sub: '今天的课程正在等您',
      id: '账号', idph: '输入账号',
      pw: '密码', pwph: '输入密码',
      save: '记住账号和密码', login: '登录',
      help: '没有账号？请联系班主任或管理员',
      iderr: '请输入账号', pwerr: '请输入密码'
    },
    'zh-Hant': {
      headline: '讓老師的課，走進每位學生的語言。',
      hsub: '國際學校即時翻譯授課系統',
      title: '登入', sub: '今天的課程正在等您',
      id: '帳號', idph: '輸入帳號',
      pw: '密碼', pwph: '輸入密碼',
      save: '記住帳號和密碼', login: '登入',
      help: '沒有帳號？請聯絡班導師或管理員',
      iderr: '請輸入帳號', pwerr: '請輸入密碼'
    }
  };

  /* ── 언어 적용: 문구 교체 + <html lang> 변경(폰트는 CSS가 전환) ── */
  function applyLang(code) {
    var t = I18N[code];
    if (!t) return;

    document.documentElement.lang = code;

    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] == null) return;
      if (key === 'headline') el.innerHTML = t[key];
      else el.textContent = t[key];
    });

    $$('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (t[key] != null) el.placeholder = t[key];
    });

    $$('.login-langs__item').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-lang') === code);
    });
  }

  $$('.login-langs__item').forEach(function (el) {
    el.addEventListener('click', function () {
      applyLang(el.getAttribute('data-lang'));
    });
  });

  /* ── 비밀번호 표시 토글 ── */
  var pw = $('#login-pw');
  var eye = $('#pw-eye');
  eye.addEventListener('click', function () {
    var show = pw.type === 'password';
    pw.type = show ? 'text' : 'password';
    eye.textContent = show ? 'visibility' : 'visibility_off';
  });

  /* ── 비밀번호 필드 포커스 링 ── */
  var pwField = $('#pw-field');
  pw.addEventListener('focus', function () { pwField.classList.add('is-focused'); });
  pw.addEventListener('blur', function () { pwField.classList.remove('is-focused'); });

  /* ── 아이디·비밀번호 저장 스위치 ── */
  var save = $('#save-switch');
  var saveToggle = save.querySelector('.switch');
  save.addEventListener('click', function (e) {
    e.preventDefault();
    saveToggle.classList.toggle('is-on');
  });

  /* ── 입력 검증: 빈 필드에 에러 표시 + 흔들림, 입력 시 해제 ── */
  var idInput = $('#login-id');
  var idError = $('#id-error');
  var pwError = $('#pw-error');

  function setError(field, msgEl, on) {
    field.classList.toggle('is-error', on);
    msgEl.classList.toggle('is-visible', on);
    if (on) {
      field.classList.remove('is-shaking');
      void field.offsetWidth; // 재적용을 위한 리플로우
      field.classList.add('is-shaking');
    }
  }

  idInput.addEventListener('input', function () { setError(idInput, idError, false); });
  pw.addEventListener('input', function () { setError(pwField, pwError, false); });

  /* ── 로그인: 검증 통과 시 대시보드 이동 (데모: 인증 없음) ── */
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var idEmpty = idInput.value.trim() === '';
    var pwEmpty = pw.value.trim() === '';
    setError(idInput, idError, idEmpty);
    setError(pwField, pwError, pwEmpty);

    if (idEmpty) { idInput.focus(); return; }
    if (pwEmpty) { pw.focus(); return; }
    location.href = 'dashboard.html';
  });
})();
