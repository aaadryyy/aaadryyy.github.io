const textAppear = () => {
  const articleCount = document.querySelectorAll('[id*="article"]').length;
  for (let articleId = articleCount; articleId >= 0; articleId--) {
    const article = `#article-${articleId}`;
    const text = document.querySelector(article).innerText;
    document.querySelector(article).innerText = "";
    const charactersList = text.split("");

    let characterId = 0;
    const intervalId = setInterval(() => {
      if (charactersList[characterId]) {
        document.querySelector(article).innerHTML +=
          charactersList[characterId];
        characterId++;
      } else {
        clearInterval(intervalId);
      }
    }, 30);
  }
};

textAppear();
