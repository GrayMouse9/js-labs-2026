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
            {
                id: 1,
                src: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop",
                title: "Прямой перелет",
                text: "Классическая баллистическая схема TLI (Trans-Lunar Injection), использовавшаяся в миссии Artemis I. Космический аппарат получает мощный импульс на низкой околоземной орбите и отправляется напрямую к Луне. Гарантирует максимальную скорость доставки экипажа, но требует колоссальных затрат топлива и сверхтяжелой ракеты-носителя.",
                badge: "Быстрый",
                badgeClass: "text-bg-danger",
                impulse: "3 150 м/с",
                time: "3-4 дня",
                model: "./models/RocketShip.glb" 
            },
            {
                id: 2,
                src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=1000&auto=format&fit=crop",
                title: "Гравитационный маневр",
                text: "Трансфер по слабой границе стабильности (WSB). Умная траектория, применяемая для кубсатов и модулей поддержки программы Artemis (например, миссия CAPSTONE). Аппарат использует гравитацию Земли и Солнца, чтобы «забросить» себя на орбиту Луны. Позволяет сэкономить до 20% топлива, но значительно увеличивает время перелета.",
                badge: "Экономичный",
                badgeClass: "text-bg-success",
                impulse: "2 700 м/с",
                time: "3-4 месяца",
                model: "./models/InternationalSpaceStation.glb"
            },
            {
                id: 3,
                src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
                title: "Перелет с ожиданием",
                text: "Фазирующая орбита (Phasing loops). Аппарат совершает несколько высокоэллиптических витков вокруг Земли перед финальным рывком к Луне. Применяется для синхронизации пилотируемого корабля со станцией Lunar Gateway. Позволяет протестировать все системы в космосе до невозврата и дождаться идеального баллистического окна.",
                badge: "Гибкий",
                badgeClass: "text-bg-warning",
                impulse: "3 050 м/с",
                time: "10-14 дней",
                model: "./models/Moon.glb"
            },
        ];
        return trajectories.find(t => t.id === this.id);
    }

    get pageRoot() {
        return document.getElementById('service-page')
    }

    getHTML() {
        return `<div id="service-page" class="p-4"></div>`
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
