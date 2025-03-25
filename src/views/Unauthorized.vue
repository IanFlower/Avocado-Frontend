<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <div class="error-container">
            <div class="error-content">
                <h1 class="error-code">401</h1>
                <p class="error-message">Oops! You don't have permission to access this page.</p>
                <p class="error-message">This attempt has been recorded.</p>
                <router-link to="/home" class="back-home">Go Back Home</router-link>
            </div>
        </div>
    </v-container>
</template>


<style scoped>
.error-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.error-content {
    text-align: center;
    padding: 8rem;
    background-color: var(--background);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.568);
    border-radius: 16px;
}

.error-code {
    font-size: 6rem;
    font-weight: bold;
    color: #e74c3c;
}

.error-message {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
}

.back-home {
    text-decoration: none;
    font-size: 1.1rem;
    color: var(--alt);
    border: 2px solid var(--alt);
    padding: 0.75rem 1.5rem;
    border-radius: 5px;
    transition: all 0.3s;
}

.back-home:hover {
    background-color: var(--alt);
    color: #fff;
    border-color: var(--alt);
}
</style>