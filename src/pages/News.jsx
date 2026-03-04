
import { useEffect } from 'react';
import styled from 'styled-components';
import { useTools } from '../context/ToolContext';

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
  display: flex;
  justify-content: space-between;
  align-items: center;

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

const BookmarkButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  color: ${props => (props.bookmarked ? '#ffc107' : '#ccc')};
`;

function NewsPage() {
  const { news, selectedArticle, setSelectedArticle, toggleNewsBookmark, isNewsBookmarked } = useTools();

  return (
    <NewsPageContainer>
      <PageTitle>최신 AI 뉴스</PageTitle>
      <NewsList>
        {news.items.map((item) => (
          <NewsItem key={item.link} onClick={() => setSelectedArticle(item)} style={{backgroundColor: selectedArticle?.link === item.link ? '#f0f0f0' : 'transparent'}}>
            <div>
              <NewsLink href={item.link} target="_blank" rel="noopener noreferrer">
                <NewsTitle>{item.title}</NewsTitle>
                <NewsDescription>{item.description}</NewsDescription>
                <NewsMeta>{item.relativeTime}</NewsMeta>
              </NewsLink>
            </div>
            <BookmarkButton 
              bookmarked={isNewsBookmarked(item.link)}
              onClick={(e) => {
                e.stopPropagation(); // Stop the event from bubbling up to the NewsItem
                toggleNewsBookmark(item);
              }}
            >
              {isNewsBookmarked(item.link) ? '★' : '☆'}
            </BookmarkButton>
          </NewsItem>
        ))}
      </NewsList>
    </NewsPageContainer>
  );
}

export default NewsPage;
