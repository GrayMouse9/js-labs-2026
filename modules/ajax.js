class Ajax {

    async _request(method, url, data) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data !== undefined) {
            options.body = JSON.stringify(data);
        }
 
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    get(url) {
        return this._request('GET', url);
    }

    post(url, data) {
        return this._request('POST', url, data);
    }

    patch(url, data) {
        return this._request('PATCH', url, data);
    }

    delete(url) {
        return this._request('DELETE', url);
    }
}

export const ajax = new Ajax();
