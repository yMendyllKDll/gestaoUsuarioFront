export interface User {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    tipoUsuario?: 'ADMIN' | 'USUARIO';
    dataCriacao?: string;
    enderecos?: Address[];
    token?: string;
}

export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}

export interface Sort {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        sort: Sort;
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
}

export interface Address {
    id?: number;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    usuarioId?: number;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface RegisterRequest {
    nome: string;
    email: string;
    senha: string;
}

export interface DecodedToken {
    sub: string;
    exp: number;
    tipoUsuario: string;
}
