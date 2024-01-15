const API_URL = 'http://localhost:3000'

export const createBook = async (data) => {
    const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateBook = async (data) => {
    const response = await fetch(`${API_URL}/books/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchBook = async () => {
    const response = await fetch(`${API_URL}/books`)
    return response.json();
}

export const deleteBook = async (id) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createUnit = async (data) => {
    const response = await fetch(`${API_URL}/units`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateUnit = async (data) => {
    const response = await fetch(`${API_URL}/units/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchUnitByBookId = async (bookId) => {
    const response = await fetch(`${API_URL}/units?bookId=${bookId}`)
    return response.json();
}

export const deleteUnit = async (bookId) => {
    const response = await fetch(`${API_URL}/units/${bookId}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createPart = async (data) => {
    const response = await fetch(`${API_URL}/parts`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updatePart = async (data) => {
    const response = await fetch(`${API_URL}/parts/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchPartByUnitId = async (id) => {
    const response = await fetch(`${API_URL}/parts?unitId=${id}`)
    return response.json();
}

export const deletePart = async (id) => {
    const response = await fetch(`${API_URL}/parts/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createQuestion = async (data) => {
    const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateQuestion = async (data) => {
    const response = await fetch(`${API_URL}/questions/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchQuestionByPartId = async (id) => {
    const response = await fetch(`${API_URL}/questions?partId=${id}`)
    return response.json();
}

export const deleteQuestion = async (id) => {
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}