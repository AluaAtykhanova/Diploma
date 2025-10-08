async function checkFiles() {
    try {
        const files = await openai.files.list();
        console.log("📂 Список файлов:", files);
    } catch (error) {
        console.error("❌ Ошибка при получении списка файлов:", error);
    }
}

checkFiles();
