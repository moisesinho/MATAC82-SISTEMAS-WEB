document.addEventListener("DOMContentLoaded", () => {
    // Variáveis principais
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const newTaskInput = document.getElementById("new-task");
    const goalForm = document.getElementById("goal-form");
    const notificationsToggle = document.getElementById("notificacoes");
    const darkModeToggle = document.getElementById("dark-mode");
    const fontSizeSelect = document.getElementById("font-size");
    const body = document.body;

    // Navegação suave entre seções
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const sectionId = link.getAttribute("href").substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // Adicionar nova tarefa
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = newTaskInput.value.trim();

        if (taskText !== "") {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `
                ${taskText} - <span>Em andamento</span>
                <div>
                    <button class="btn btn-sm btn-warning me-2">Editar</button>
                    <button class="btn btn-sm btn-danger">Remover</button>
                </div>
            `;

            // Remoção da tarefa
            listItem.querySelector(".btn-danger").addEventListener("click", () => {
                taskList.removeChild(listItem);
            });

            // Edição da tarefa
            listItem.querySelector(".btn-warning").addEventListener("click", () => {
                const newTaskText = prompt("Edite a tarefa:", taskText);
                if (newTaskText) {
                    listItem.childNodes[0].nodeValue = `${newTaskText} - `;
                }
            });

            taskList.appendChild(listItem);
            newTaskInput.value = "";
        }
    });

    // Adicionar nova meta
    goalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const metaNome = document.getElementById("meta-nome").value.trim();
        if (metaNome !== "") {
            alert(`Meta "${metaNome}" adicionada com sucesso!`);
            goalForm.reset();
        }
    });

    // Alternar tema escuro
    darkModeToggle.addEventListener("change", () => {
        if (darkModeToggle.checked) {
            body.classList.add("dark-mode");
        } else {
            body.classList.remove("dark-mode");
        }

        document.querySelectorAll("input, select").forEach(el => {
            el.style.backgroundColor = getComputedStyle(el).backgroundColor;
            el.style.color = getComputedStyle(el).color;
        });

    });
    
    

    // Configuração de notificações
    notificationsToggle.addEventListener("change", () => {
        if (notificationsToggle.checked) {
            alert("Notificações ativadas!");
        } else {
            alert("Notificações desativadas!");
        }
    });

    // Alterar tamanho da fonte
    fontSizeSelect.addEventListener("change", () => {
        const fontSize = fontSizeSelect.value;
        body.style.fontSize = fontSize === "small" ? "0.875rem" : fontSize === "large" ? "1.25rem" : "1rem";
    });

    // Configuração do gráfico
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Trabalho", "Estudos", "Lazer", "Outros"],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });

    // Atualizar o gráfico dinamicamente
    function updateChart(data) {
        chart.data.datasets[0].data = data;
        chart.update();
    }

    // Atualização automática do progresso
    function calculateProgress() {
        const totalTasks = taskList.children.length;
        const completedTasks = Array.from(taskList.children).filter(task => task.textContent.includes("Concluído")).length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        updateChart([progress, 100 - progress]);
    }

    taskList.addEventListener("click", calculateProgress);
});