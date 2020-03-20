import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loading, Owner, IssueList, IssueFilter, PageActions } from './styles';
import Container from '../../component/Container';

export default class Repository extends Component {
  // Uso as propTypes como propriedade estática da classe
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filters: [
      { state: 'all', label: 'Todas', active: true },
      { state: 'open', label: 'Abertas', active: false },
      { state: 'closed', label: 'Fechadas', active: false },
    ],
    filterIndex: 0,
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props; /** this é referente a minha classe */
    const { filters } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    // const repository = await api.get(`/repos/${repoName}`);
    // const issues = await api.get(`/repos/${repoName}/issues`);

    // Realizo duas requisiçoes ao mesmo tempo
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find(f => f.active).state,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  loadIssues = async () => {
    const { match } = this.props;
    const { filters, filterIndex, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filters[filterIndex].state,
        per_page: 5,
        page,
      },
    });

    this.setState({ issues: response.data });
  };

  handleFilterClick = async filterIndex => {
    await this.setState({ filterIndex });
    this.loadIssues();
  };

  handlePage = async action => {
    const { page } = this.state;

    this.setState({
      page: action === 'back' ? page - 1 : page + 1,
    });
    this.loadIssues();
  };

  render() {
    const {
      repository,
      issues,
      loading,
      filters,
      filterIndex,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          <IssueFilter active={filterIndex}>
            {filters.map((filter, index) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => this.handleFilterClick(index)}
              >
                {filter.label}
              </button>
            ))}
          </IssueFilter>
          {issues.map(issue => (
            <li
              key={
                String(issue.id) /** Encapsula o id para retornar como string */
              }
            >
              <img src={issue.user.avatar_url} alt={issue.user.login} />

              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <PageActions>
          <button
            type="button"
            disabled={page < 2}
            onClick={() => {
              this.handlePage('back');
            }}
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button
            type="button"
            onClick={() => {
              this.handlePage('next');
            }}
          >
            Próxima
          </button>
        </PageActions>
      </Container>
    );
  }
}
