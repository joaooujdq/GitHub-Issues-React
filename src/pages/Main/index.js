import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api'

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {

    state = {
        newRepo: '',
        repositories: [],
        loading: false,
    };
    /* Carrega os dados do local storage */
    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) })
            //Json.Parse converte campos em json para valores em objeto do
            //javscript
        }
    }
    /* Salva os dados do localStorage quando o component atualiza */
    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories))
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value })
    };

    handleSubmit = async e => {
        e.preventDefault(); //previne que o formulario de um refresh na pagina
        this.setState({ loading: true });
        const { newRepo, repositories } = this.state;
        const response = await api.get(`/repos/${newRepo}`);

        const data = {
            name: response.data.full_name,

        };
        this.setState({
            repositories: [...repositories, data],
            newRepo: '',
            loading: false,
        });
    }

    render() {
        const { newRepo, loading, repositories } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                Repositórios
                </h1>

                <Form onSubmit={this.handleSubmit}>
                    <input type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {
                            loading ? (<FaSpinner color="#FFF" size={14} />
                            ) : (
                                    <FaPlus color="#FFF" size={14} />
                                )}
                    </SubmitButton>
                </Form>

                {/* Utilizar chaves no meio de codigo html, permite
                        inserir javascript, graças ao react  */}

                <List>
                    {repositories.map(repository => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>

                            <Link to={`/repository/${
                                encodeURIComponent(repository.name)
                                }`}>Detalhes</Link>


                        </li>
                    ))} {/* Usamos o map para percorrer os repositorios */}
                </List>
            </Container>
        );
    }
}

