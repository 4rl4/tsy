console.log("TES");

const supabaseUrl =
"https://pilndoaauiwwfsckqtor.supabase.co";

const supabaseKey =
"sb_publishable_pRrKw9JfF8tjSZvWOED1mg_FiAlgMiD";

const myClient =
window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

console.log("myClient", myClient);

async function uploadArt() {

    // 1. Ambil file
    const file =
        document.getElementById("uploadImage")
        .files[0];

    const username =
    document.getElementById("username")
    .value;

    if (!file) {
        alert("Pilih gambar dulu!");
        return;
    }

    // 2. Nama file
    const fileName =
        Date.now() + "-" + file.name;

    // 3. Upload ke Storage
    const { data, error } =
        await myClient.storage
        .from("gallery")
        .upload(fileName, file);

    console.log("UPLOAD DATA:", data);
    console.log("UPLOAD ERROR:", error);

    if (error) return;


    // 4. Ambil Public URL
    const { data: urlData } =
        myClient.storage
        .from("gallery")
        .getPublicUrl(fileName);

    console.log("URL:", urlData.publicUrl);

    // 5. Simpan URL ke Database
    const { error: dbError } =
        await myClient
        .from("gallery")
        .insert([
            {
                image_url: urlData.publicUrl,
                file_path: fileName,
                username : username
            }
        ]);

    console.log("DB ERROR:", dbError);

    // 6. Refresh gallery otomatis
    loadGallery();

}

async function loadGallery() {

    const galleryWall =
        document.getElementById("galleryWall");

    galleryWall.innerHTML = "";

    const { data, error } =
        await myClient
        .from("gallery")
        .select("*")
        .order("created_at", {
            ascending: false
        });

    if (error) {
        console.error(error);
        return;
    }

    data.forEach(item => {

        const frame =
            document.createElement("div");

        frame.classList.add("frame");

       frame.innerHTML = `
        <img src="${item.image_url}">
        <h3>Community Art</h3>
        <p>By ${item.username}</p>

        <p>❤️ ${item.likes || 0}</p>

        <p class="upload-date">
            📅 ${new Date(item.created_at).toLocaleDateString()}
        </p>

        <button onclick="likeArt(${item.id})">
            ❤️ Like
        </button>

        <button onclick="deleteArt(${item.id}, '${item.file_path}')">
            🗑️ Delete
        </button>
        `;

        galleryWall.appendChild(frame);

    });
}

loadGallery();

async function deleteArt(id, filePath) {

    const confirmDelete =
        confirm("Delete this artwork?");

    if (!confirmDelete) return;

    // hapus file storage
    const { error: storageError } =
        await myClient.storage
            .from("gallery")
            .remove([filePath]);

    if (storageError) {
        console.error(storageError);
        return;
    }

    // hapus data database
    const { error: dbError } =
        await myClient
            .from("gallery")
            .delete()
            .eq("id", id);

    if (dbError) {
        console.error(dbError);
        return;
    }

    loadGallery();
}

window.likeArt = async function(id){

    let { data } = await myClient
    .from("gallery")
    .select("likes")
    .eq("id", id)
    .single();

    const currentLikes = data.likes || 0;

    await myClient
    .from("gallery")
    .update({
        likes: currentLikes + 1
    })
    .eq("id", id);

    loadGallery();
}

window.uploadArt = uploadArt;
window.deleteArt = deleteArt;
