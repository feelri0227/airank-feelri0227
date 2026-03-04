import styled from 'styled-components';
import { useTools } from '../../context/ToolContext';

const SidebarContainer = styled.aside`
  width: 250px;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h2`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-primary);
`;

const ToolList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ToolItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
      background-color: var(--bg-secondary-accent);
  }
`;

const ToolLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  margin-right: 0.8rem;
  object-fit: cover;
  border: 1px solid var(--border-primary);
`;

const ToolInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ToolName = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ToolDescription = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


function ToolListSidebar() {
  const { tools, setSelectedToolById } = useTools();

  const sortedTools = [...tools].sort((a, b) => b.score - a.score);

  const handleToolClick = (id) => {
    setSelectedToolById(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <SidebarContainer>
        <SidebarTitle>🔥 주간 AI 랭킹</SidebarTitle>
        <ToolList>
            {sortedTools.slice(0, 20).map(tool => (
                <ToolItem key={tool.id} onClick={() => handleToolClick(tool.id)} title={`자세히 보기: ${tool.name}`}>
                    <ToolLogo src={tool.logo} alt={`${tool.name} logo`} />
                    <ToolInfo>
                        <ToolName>{tool.name}</ToolName>
                        <ToolDescription>{tool.description}</ToolDescription>
                    </ToolInfo>
                </ToolItem>
            ))}
        </ToolList>
    </SidebarContainer>
  );
}

export default ToolListSidebar;
