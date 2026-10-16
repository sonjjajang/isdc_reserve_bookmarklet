(function () {
  /* raw.githubusercontent.com은 경로를 5분간 캐싱하고(max-age=300), 쿼리스트링을
     캐시 키에 안 넣는 것으로 실측 확인됨 - 그래서 "?_=timestamp" 같은 캐시
     방지 트릭이 전혀 안 먹혔고, push 직후 바로 테스트하면 몇 분간 옛날 버전을
     계속 받는 문제가 있었다. 커밋 SHA로 고정한 raw URL은 그 내용이 절대
     안 바뀌니 영원히 캐싱해도 안전한데, 그 SHA 자체를 매번 GitHub API로
     새로 물어보면(이 API는 캐싱이 훨씬 짧음) 결과적으로 늘 최신을 받게 된다. */
  var repo = 'sonjjajang/isdc_reserve_bookmarklet';
  var file = 'combined_mobile.js';
  fetch('https://api.github.com/repos/' + repo + '/commits/main', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('커밋 조회 실패 HTTP ' + r.status);
      return r.json();
    })
    .then(function (commit) {
      var sha = commit.sha;
      return fetch('https://raw.githubusercontent.com/' + repo + '/' + sha + '/' + file, { cache: 'no-store' });
    })
    .then(function (r) {
      if (!r.ok) throw new Error('소스 조회 실패 HTTP ' + r.status);
      return r.text();
    })
    .then(function (code) {
      (0, eval)(code);
    })
    .catch(function (e) {
      alert('북마크릿 로드 실패: ' + e.message + '\n\n인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.');
    });
})();
