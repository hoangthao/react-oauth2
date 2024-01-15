const API_URL = 'http://localhost:3000'

export const createBook = async (data) => {
    console.log('call createBook')
    const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateBook = async (data) => {
    console.log('call updateBook')
    const response = await fetch(`${API_URL}/books/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchBook = async () => {
    console.log('call fetchBook')
    const response = await fetch(`${API_URL}/books`)
    return response.json();
}

export const deleteBook = async (id) => {
    console.log('call deleteBook')
    const response = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createUnit = async (data) => {
    console.log('call createUnit')
    const response = await fetch(`${API_URL}/units`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateUnit = async (data) => {
    console.log('call updateUnit')
    const response = await fetch(`${API_URL}/units/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchUnitByBookId = async (bookId) => {
    console.log('call fetchUnitByBookId')
    const response = await fetch(`${API_URL}/units?bookId=${bookId}`)
    return response.json();
}

export const deleteUnit = async (bookId) => {
    console.log('call deleteUnit')
    const response = await fetch(`${API_URL}/units/${bookId}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createPart = async (data) => {
    console.log('call createPart')
    const response = await fetch(`${API_URL}/parts`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updatePart = async (data) => {
    console.log('call updatePart')
    const response = await fetch(`${API_URL}/parts/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchPartByUnitId = async (id) => {
    console.log('call fetchPartByUnitId')
    const response = await fetch(`${API_URL}/parts?unitId=${id}`)
    return response.json();
}

export const deletePart = async (id) => {
    console.log('call deletePart')
    const response = await fetch(`${API_URL}/parts/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createQuestion = async (data) => {
    console.log('call createQuestion')
    const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateQuestion = async (data) => {
    console.log('call updateQuestion')
    const response = await fetch(`${API_URL}/questions/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchQuestionByPartId = async (id) => {
    console.log('call fetchQuestionByPartId')
    const response = await fetch(`${API_URL}/questions?partId=${id}`)
    return response.json();
}

export const deleteQuestion = async (id) => {
    console.log('call deleteQuestion')
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const fetchQuestionById = async (id) => {
    console.log('call fetchQuestionById')
    const response = await fetch(`${API_URL}/questions/${id}`)
    return response.json();
}