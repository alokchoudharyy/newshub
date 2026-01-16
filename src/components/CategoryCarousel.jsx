import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const categories = [
  { id: "top", label: "🔥 Top" },
  { id: "business", label: "💼 Business" },
  { id: "technology", label: "💻 Technology" },
  { id: "sports", label: "⚽ Sports" },
  { id: "health", label: "🏥 Health" },
  { id: "entertainment", label: "🎬 Entertainment" },
  { id: "science", label: "🔬 Science" },
];

function CategoryCarousel() {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="inner" style={{ "--quantity": categories.length }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="card"
              style={{
                "--index": i,
                "--colorCard": `${100 + i * 15}, ${150 + i * 10}, 255`,
              }}
              onClick={() => navigate(`/news?category=${cat.id}`)}
            >
              <div className="img">
                <span>{cat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .wrapper {
    width: 100%;
    height: 350px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .inner {
    --w: 140px;
    --h: 180px;
    --translateZ: 280px;
    --rotateX: -12deg;
    --perspective: 1000px;

    position: absolute;
    width: var(--w);
    height: var(--h);
    transform-style: preserve-3d;
    transform: perspective(var(--perspective));
    animation: rotating 40s linear infinite; /* 🔥 slow premium rotation */
  }

  @keyframes rotating {
    from {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
    }
    to {
      transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
    }
  }

  .card {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    cursor: pointer;
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(var(--translateZ));
    transition: transform 0.4s ease;
  }

  .card:hover {
    transform: rotateY(calc((360deg / var(--quantity)) * var(--index)))
      translateZ(calc(var(--translateZ) + 30px))
      scale(1.05);
  }

  .img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1rem;
    color: white;
    background: radial-gradient(
      circle,
      rgba(var(--colorCard), 0.4),
      rgba(var(--colorCard), 0.9)
    );
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
    padding: 10px;
  }
`;

export default CategoryCarousel;
