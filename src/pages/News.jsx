
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NewsPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NewsItem = styled.li`
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const NewsLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover h2 {
    color: #007bff;
  }
`;

const NewsTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  transition: color 0.2s;
`;

const NewsDescription = styled.p`
  color: #555;
  margin: 0 0 0.5rem 0;
`;

const NewsMeta = styled.span`
  font-size: 0.9rem;
  color: #999;
`;

function NewsPage() {
  const [news, setNews] = useState({ items: [], lastUpdated: '' });

  useEffect(() => {
    fetch('/news.json')
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <NewsPageContainer>
      <PageTitle>최신 AI 뉴스</PageTitle>
      <NewsList>
        {news.items.map((item) => (
          <NewsItem key={item.link}>
            <NewsLink href={item.link} target="_blank" rel="noopener noreferrer">
              <NewsTitle>{item.title}</NewsTitle>
              <NewsDescription>{item.description}</NewsDescription>
              <NewsMeta>{item.relativeTime}</NewsMeta>
            </NewsLink>
          </NewsItem>
        ))}
      </NewsList>
    </NewsPageContainer>
  );
}

export default NewsPage;

