export class ServiceCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return (
            `
                <div class="card m-2" style="width: 300px;">
                    <img class="card-img-top" src="${data.src}" alt="луна" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${data.title}
                            <span class="badge ${data.badgeClass}">${data.badge}</span>
                        </h5>
                        <p class="card-text">${data.text}</p>
                        <button class="btn btn-dark" id="click-card-${data.id}" data-id="${data.id}">Выбрать орбиту</button>
                    </div>
                </div>
            `
        )
    }

    addListeners(data, listener) {
        document
            .getElementById(`click-card-${data.id}`)
            .addEventListener("click", listener)
    }

    render(data, listener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, listener)
    }
}
