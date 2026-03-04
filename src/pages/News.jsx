
import styled from 'styled-components';
import { useTools } from '../context/ToolContext';
import { useAuth } from '../context/AuthContext';
import ToolListSidebar from '../components/layout/ToolListSidebar';

const NewsPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 2.5rem;
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--text-primary);
`;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NewsItem = styled.li`
  position: relative;
  border-bottom: 1px solid var(--border-primary);
  padding: 1.5rem 0;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }
`;

const NewsContent = styled.div`
  padding-right: 2.5rem; // Space for the bookmark button
`;

const NewsLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover h2 {
    color: var(--accent-blue);
  }
`;

const NewsTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  transition: color 0.2s;
`;

const NewsDescription = styled.p`
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
`;

const NewsMeta = styled.span`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const BookmarkButton = styled.button`
  position: absolute;
  top: 1.2rem;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.3rem;
  color: ${props => (props.bookmarked ? '#ffc107' : 'var(--text-muted)')};
  transition: all 0.2s ease;
  z-index: 5;

  &:hover {
    transform: scale(1.2);
    color: #ffc107;
  }
`;

function NewsPage() {
  const { user } = useAuth();
  const { news, selectedArticle, setSelectedArticle, toggleNewsBookmark, isNewsBookmarked } = useTools();

  const handleItemClick = (item) => {
    setSelectedArticle(item);
  };

  const handleBookmarkClick = (e, item) => {
    e.stopPropagation();
    toggleNewsBookmark(item);
  };

  return (
    <NewsPageContainer>
      <ToolListSidebar />
      <MainContent>
        <PageTitle>📰 최신 AI 뉴스</PageTitle>
        <NewsList>
          {news.items.map((item) => {
            const isBookmarked = isNewsBookmarked(item.link);
            return (
              <NewsItem 
                key={item.link} 
                onClick={() => handleItemClick(item)} 
                style={{backgroundColor: selectedArticle?.link === item.link ? 'var(--bg-secondary-accent)' : 'transparent'}}
              >
                <NewsContent>
                  <NewsLink href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <NewsTitle>{item.title}</NewsTitle>
                    <NewsDescription>{item.description}</NewsDescription>
                    <NewsMeta>{item.relativeTime}</NewsMeta>
                  </NewsLink>
                </NewsContent>
                {user && (
                  <BookmarkButton 
                    bookmarked={isBookmarked}
                    onClick={(e) => handleBookmarkClick(e, item)}
                    title={isBookmarked ? "북마크 제거" : "북마크 추가"}
                  >
                    {isBookmarked ? '★' : '☆'}
                  </BookmarkButton>
                )}
              </NewsItem>
            );
          })}
        </NewsList>
      </MainContent>
    </NewsPageContainer>
  );
}

export default NewsPage;
