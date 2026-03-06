
import { useState } from 'react';
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
  align-items: flex-start; // sticky를 위해 추가
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

const SidebarWrapper = styled.div`
  position: sticky;
  top: 100px; // 네비게이션 높이 고려하여 조정
  align-self: start;

  @media (max-width: 768px) {
    display: none;
  }
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

const LoadMoreButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 2.5rem;
  background: transparent;
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }
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

const PAGE_SIZE = 15;

function NewsPage() {
  const { user } = useAuth();
  const { news, selectedArticle, setSelectedArticle, toggleNewsBookmark, isNewsBookmarked } = useTools();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleItemClick = (item) => {
    setSelectedArticle(item);
  };

  const handleBookmarkClick = (e, item) => {
    e.stopPropagation();
    toggleNewsBookmark(item);
  };

  const visibleItems = (news?.items || []).slice(0, visibleCount);
  const hasMore = visibleCount < (news?.items?.length || 0);

  return (
    <NewsPageContainer>
      <SidebarWrapper><ToolListSidebar /></SidebarWrapper>
      <MainContent>
        <PageTitle>📰 최신 AI 뉴스</PageTitle>
        <NewsList>
          {visibleItems.map((item) => {
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
        {hasMore && (
          <LoadMoreButton onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>
            더보기
          </LoadMoreButton>
        )}
      </MainContent>
    </NewsPageContainer>
  );
}

export default NewsPage;
