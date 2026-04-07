import {ServiceCardComponent} from "../../components/service-card/index.js";
import {ServicePage} from "../service/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = this.getData();
    }

    get pageRoot() {
        return document.getElementById('main-page')
    }

    getHTML() {
        return (
            `
                <div class="container mt-4">
                    <h2 class="mb-4">Каталог услуг: Расчет траекторий</h2>
                    <input type="text" id="search-input" class="form-control mb-4" placeholder="Поиск траектории по названию...">

                    <div id="main-page" class="d-flex flex-wrap justify-content-start gap-3"></div>
                </div>
            `
        )
    }

    getData() {
        return [
            { id: 1, src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop", title: "Прямой перелет", text: "Классическая схема полета Аполлонов. Высокие затраты топлива.", badge: "Быстрый", badgeClass: "text-bg-danger", impulse: "3 150 м/с", time: "3-4 дня" },
            { id: 2, src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000&auto=format&fit=crop", title: "Гравитационный маневр", text: "Использование гравитации Земли и Луны для разгона. Экономия топлива.", badge: "Экономичный", badgeClass: "text-bg-success", impulse: "2 800 м/с", time: "14-20 дней" },
            { id: 3, src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop", title: "Перелет с ожиданием", text: "Вывод на фазирующую орбиту и ожидание оптимального окна.", badge: "Гибкий", badgeClass: "text-bg-warning", impulse: "3 050 м/с", time: "От 30 дней" },
        ]
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const servicePage = new ServicePage(this.parent, cardId)
        servicePage.render()
    }

    addSearchListener() {
        document.getElementById('search-input').addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const filteredData = this.data.filter(item => item.title.toLowerCase().includes(searchText));
            this.renderCards(filteredData);
        });
    }

    renderCards(dataToRender) {
        this.pageRoot.innerHTML = '';
        dataToRender.forEach((item) => {
            const serviceCard = new ServiceCardComponent(this.pageRoot)
            serviceCard.render(item, this.clickCard.bind(this))
        })
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        this.renderCards(this.data);
        this.addSearchListener();
    }
}
