const API_URL = 'http://localhost:4000'

export const createAnswer = async (data) => {
    console.log('call createAnswer')
    const response = await fetch(`${API_URL}/answers`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateAnswer = async (data) => {
    console.log('call updateAnswer')
    const response = await fetch(`${API_URL}/answers/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchAnswerByQuestionyId = async (id) => {
    console.log('call fetchAnswerByQuestionyId')
    const response = await fetch(`${API_URL}/answers?questionId=${id}`)
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

export const fetchQuestionByCategoryId = async (id) => {
    console.log('call fetchQuestionByCategoryId')
    const response = await fetch(`${API_URL}/questions?categoryId=${id}`)
    return response.json();
}

export const deleteQuestion = async (id) => {
    console.log('call deleteQuestion')
    const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

export const createCategory = async (data) => {
    console.log('call createCategory')
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const updateCategory = async (data) => {
    console.log('call updateCategory')
    const response = await fetch(`${API_URL}/categories/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return response.json();
}

export const fetchCategory = async () => {
    console.log('call fetchCategory')
    const response = await fetch(`${API_URL}/categories`)
    return response.json();
}

export const deleteCategory = async (id) => {
    console.log('call deleteCategory')
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}
