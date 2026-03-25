import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {ServiceComponent} from "../../components/service/index.js";

export class ServicePage {
    constructor(parent, id) {
        this.parent = parent
        this.id = parseInt(id)
    }

    getData() {
        const trajectories = [
            { id: 1, src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop", title: "Прямой перелет", text: "Классическая схема полета Аполлонов. Высокие затраты топлива.", badge: "Быстрый", badgeClass: "text-bg-danger", impulse: "3 150 м/с", time: "3-4 дня" },
            { id: 2, src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000&auto=format&fit=crop", title: "Гравитационный маневр", text: "Использование гравитации Земли и Луны для разгона. Экономия топлива.", badge: "Экономичный", badgeClass: "text-bg-success", impulse: "2 800 м/с", time: "14-20 дней" },
            { id: 3, src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop", title: "Перелет с ожиданием", text: "Вывод на фазирующую орбиту и ожидание оптимального окна.", badge: "Гибкий", badgeClass: "text-bg-warning", impulse: "3 050 м/с", time: "От 30 дней" },
        ];
        return trajectories.find(t => t.id === this.id);
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
        return `<div id="product-page" class="p-4"></div>`
    }

    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const data = this.getData()
        const service = new ServiceComponent(this.pageRoot)
        service.render(data)
    }
}
