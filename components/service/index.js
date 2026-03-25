export class ServiceComponent{
    constructor(parent) {
        this.parent = parent
    }

    getHTML(data) {
        return (
            `
                <div class="card mt-3" style="max-width: 800px;">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${data.src}" class="img-fluid rounded-start" alt="луна" style="height: 100%; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h4 class="card-title">
                                    ${data.title}
                                    <span class="badge ${data.badgeClass}">${data.badge}</span>
                                </h4>
                                <p class="card-text">${data.text}</p>
                                <hr>

                                <h5>Оформление заявки на расчет:</h5>

                                <div class="mb-3">
                                    <label for="launchDate" class="form-label">Заданная дата старта</label>
                                    <input type="date" class="form-control" id="launchDate">
                                </div>
                                <div class="mb-3">
                                    <label for="shipMass" class="form-label">Масса космического аппарата (кг)</label>
                                    <input type="number" class="form-control" id="shipMass" placeholder="Например: 5000">
                                </div>

                                <div class="alert alert-secondary mt-3" role="alert">
                                    <strong>Результат баллистического расчета:</strong><br>
                                    Требуемый импульс (ΔV): <span class="text-primary fw-bold">${data.impulse}</span><br>
                                    Время перелета: <span class="text-primary fw-bold">${data.time}</span>
                                </div>

                                <button class="btn btn-dark w-100">Отправить заявку в баллистический центр</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }

    render(data) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
    }
}
