import styled, { keyframes, css } from 'styled-components';

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1; /*ocupa todo o espaço*/
    border: 1px solid #eee;
    padding: 10px 15px; /* 10 em cima e em baixo &  15 para ambos os lados */
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg); /** sem nenhuma rotação */
  }

  to{
    transform: rotate(360deg) /** rotação total de 360*/
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
  /** passo o atributo através do attrs para inform qual o tipo */
  type: 'submit',
  disabled: props.loading, // prop disabled baseada na prop loading
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  /** Com esses 3 parâmetros abaixo, informa que todo conteúdo dentro do button será alinhado ao centro  */
  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${props =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
/**conjunto de propriedade de css */
  /* svg {
    animation: ${rotate} 2s linear infinite;
  } */
`;

export const List = styled.ul`
  list-style: none; /**para tirar as bolinhas da lista */
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between; /** joga o titulo para esquerda e o link detalhe totalmente para direita*/
    align-items: center;

    & + li {
      border-top: 1px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none; /** para tirar o subinhado do ling */
    }
  }
`;
