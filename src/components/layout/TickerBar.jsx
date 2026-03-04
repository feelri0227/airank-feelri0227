import { useTools } from "../../context/ToolContext";
import styled, { keyframes } from "styled-components";

const ticker = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TickerContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
`;

const TickerWrapper = styled.div`
  display: flex;
  animation: ${ticker} 80s linear infinite;
`;

const TickerItem = styled.div`
  flex-shrink: 0;
  padding: 10px 20px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
`;

const TickerBar = () => {
  const { tools } = useTools();

  // "Live" and updated tools
  const liveTools = tools
    .filter((tool) => tool.live)
    .sort((a, b) => b.score - a.score);

  // Non-"Live" and non-updated tools
  const otherTools = tools
    .filter((tool) => !tool.live)
    .sort((a, b) => b.score - a.score);

  const allTools = [...liveTools, ...otherTools, ...liveTools, ...otherTools];

  return (
    <TickerContainer>
      <TickerWrapper>
        {allTools.map((tool, index) => (
          <TickerItem key={`${tool.id}-${index}`}>
            {tool.live ? "[LIVE] " : ""}
            <strong>{tool.name}</strong> - {tool.description} - Score: {tool.score}
          </TickerItem>
        ))}
      </TickerWrapper>
    </TickerContainer>
  );
};

export default TickerBar;
