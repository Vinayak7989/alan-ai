import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import alanBtn from '@alan-ai/alan-sdk-web';


import { NewsCards, Modal } from './components';
import useStyles from './styles';

const App = () => {
  const [activeArticle, setActiveArticle] = useState(0);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: 'ee8303c9b8c56f20c17d9b322a3784d92e956eca572e1d8b807a3e2338fdd0dc/stage',
      
      onCommand: ({ command, articles, number }) => {
        if (command === 'newHeadlines') {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === 'instructions') {
          setIsOpen(true);
        } else if (command === 'highlight') {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === 'open') {
          const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > articles.length) {
            alanBtn().playText('Please try that again...');
          } else if (article) {
            window.open(article.url, '_blank');
            alanBtn().playText('Opening...');
          } else {
            alanBtn().playText('Please try that again...');
          }
        }
      },
    });
  }, []);

  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Open article number [4]</Typography></div>
            <div className={classes.card}><Typography variant="h5" component="h2">Try saying: <br /><br />Go back</Typography></div>
          </div>
        ) : null}
        <img src="https://www.google.com/imgres?imgurl=https%3A%2F%2Fvoicebot.ai%2Fwp-content%2Fuploads%2F2019%2F10%2Falan.jpg&imgrefurl=https%3A%2F%2Fvoicebot.ai%2F2019%2F10%2F11%2Fhow-alan-ai-gives-enterprise-apps-a-voice%2F&tbnid=peX6SavK_6UKwM&vet=12ahUKEwiDz8ytn_PxAhVS8DgGHfvNBVwQMygAegUIARCvAQ..i&docid=P5XZjG6VkcIYTM&w=600&h=400&q=alan%20ai%20image&ved=2ahUKEwiDz8ytn_PxAhVS8DgGHfvNBVwQMygAegUIARCvAQ" className={classes.alanLogo} alt="logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
      {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a className={classes.link} href="https://www.linkedin.com/in/adrian-hajdin/">Vinayak Agarwal</a> 
          </Typography>
        
        </div>
      ) : null}
    </div>
  );
};

export default App;
