export default defineNuxtRouteMiddleware((to, from) => {
    if (!process.server) {
        const runtimeConfig = useRuntimeConfig();
        const token = useCookie('token')
        if (!token.value) {
            fetch(`${runtimeConfig.public.apiBase}/auth`, {
                method: 'GET',
            }).then((response) => {
                switch (response.status) {
                    case 400:
                        break;
                    case 200:
                        return response.json();
                    default:
                        return
                        break;
                }
            }).then((data) => {
                if (data) {
                    try {
                        token.value = data.token;
                    } catch (e) {
                        console.log(e, 'Не получается распарсить данные')
                    }
                }
            }).catch((err) => {
                console.error("Невозможно отправить запрос", err);
            });
            return;
        }
    }
})

