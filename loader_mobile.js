(function () {
  /* raw.githubusercontent.com은 경로를 5분간 캐싱하고(max-age=300), 쿼리스트링을
     캐시 키에 안 넣는 것으로 실측 확인됨 - 그래서 "?_=timestamp" 같은 캐시
     방지 트릭이 전혀 안 먹혔고, push 직후 바로 테스트하면 몇 분간 옛날 버전을
     계속 받는 문제가 있었다. 커밋 SHA로 고정한 raw URL은 그 내용이 절대
     안 바뀌니 영원히 캐싱해도 안전한데, 그 SHA 자체를 매번 GitHub API로
     새로 물어보면 결과적으로 늘 최신을 받게 된다 - 단, 이 API도
     "Cache-Control: public, max-age=60, s-maxage=60"을 내려보내는 것으로
     실측 확인됨(curl -D - 로 확인, gjcs_reserve_bookmarklet 세션에서 발견) -
     fetch의 cache:'no-store'는 "이 브라우저 자신의 캐시를 쓰지 말라"는
     요청일 뿐, 서버/중간 프록시(통신사 캐싱 프록시 등)에게 "캐시하지 말라"는
     HTTP 요청 헤더를 보내는 게 아니라서 막지 못한다 - push 직후 60초 안에
     재실행하면 여전히 옛날 커밋 SHA를 받을 수 있다. raw.githubusercontent.com과
     달리 이 API는 쿼리스트링으로 캐시 키가 갈리는 것으로 보여(일반적인
     CDN 동작), "?_=timestamp"를 붙여 매번 다른 URL로 만들어 우회한다. */
  var repo = 'sonjjajang/isdc_reserve_bookmarklet';
  var file = 'combined_mobile.js';
  fetch('https://api.github.com/repos/' + repo + '/commits/main?_=' + Date.now(), { cache: 'no-store' })
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
