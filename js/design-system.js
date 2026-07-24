/* ============================================================
 *  디자인시스템 페이지 스크립트
 *  원본(dc.html)의 인라인 스타일 대입을 전부 클래스 토글로 재구현.
 *  - data-sw      : 스위치 (.is-on — 노브 이동·배경 전환은 CSS)
 *  - data-chk     : 체크박스 (.is-checked — 공용 .checkbox 규칙 사용)
 *  - data-single  : 단일 선택 그룹 — 형제 해제 후 본인만 .is-active
 *                   (kind별 활성 스타일은 각 .ds-* 블록의 SCSS가 담당,
 *                    data-skip 항목은 선택 대상에서 제외)
 *  - data-multi   : 다중 선택 그룹 — 항목별 .is-active 개별 토글
 *  - data-acc     : 아코디언 — 헤더 .is-open 토글
 *                   (본문 표시·쉐브론 회전은 CSS 인접 선택자가 담당)
 * ============================================================ */
(function () {
  'use strict';

  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ── 스위치: 클릭 시 on/off 토글 ── */
  $$('[data-sw]').forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('is-on');
    });
  });

  /* ── 체크박스: 클릭 시 선택 토글 ── */
  $$('[data-chk]').forEach(function (el) {
    el.addEventListener('click', function () {
      el.classList.toggle('is-checked');
    });
  });

  /* ── 단일 선택 그룹: 클릭한 항목만 활성 (data-skip 제외) ── */
  $$('[data-single]').forEach(function (group) {
    var items = Array.prototype.slice.call(group.children).filter(function (child) {
      return !child.hasAttribute('data-skip');
    });

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        items.forEach(function (other) { other.classList.remove('is-active'); });
        item.classList.add('is-active');
      });
    });
  });

  /* ── 다중 선택 그룹: 항목별 개별 토글 ── */
  $$('[data-multi]').forEach(function (group) {
    Array.prototype.slice.call(group.children).forEach(function (item) {
      item.addEventListener('click', function () {
        item.classList.toggle('is-active');
      });
    });
  });

  /* ── 아코디언: 헤더 클릭 시 열림/닫힘 토글 ── */
  $$('[data-acc]').forEach(function (head) {
    head.addEventListener('click', function () {
      head.classList.toggle('is-open');
    });
  });

  /* ── 다크모드 토글 (문서 루트의 data-theme + 헤더 로고 교체) ── */
  var themeBtn = document.querySelector('[data-ds-theme]');
  if (themeBtn) {
    var themeIcon = themeBtn.querySelector('[data-ds-theme-ic]');
    var headerLogo = document.querySelector('[data-ds-logo]');

    themeBtn.addEventListener('click', function () {
      var toDark = document.documentElement.getAttribute('data-theme') !== 'dark';

      if (toDark) document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');

      if (themeIcon) themeIcon.textContent = toDark ? 'light_mode' : 'dark_mode';
      if (headerLogo) headerLogo.src = toDark ? 'uploads/logo-dark.png' : 'uploads/logo.png';
    });
  }
})();
