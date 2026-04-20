package com.navops.api.application.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageStorageService {

    private final Cloudinary cloudinary;

   /* public String uploadImage(MultipartFile file, String folder) throws IOException {
        log.warn("BYPASS: Cloudinary desactivado temporalmente. Devolviendo URL dummy.");

        // Devolvemos una imagen de placeholder para que no rompa el front
        return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    }

    *
     * Sube una imagen a Cloudinary en una carpeta específica.
     *
     * @param file archivo multipart que se va a subir.
     * @param folder de la carpeta en Cloudinary  (eJ: "profile_pictures", "ships", "system_assets")
     * @return la URL segura de la imagen subida.
     * @throws IOException  si se produce un error al leer el archivo o al comunicarse con Cloudinary.
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {

        log.info("Subiendo la imagen a Cloudinary en la carpeta: {}", folder);

        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false,
                "upload_preset", "NavOps"
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        
        String url = uploadResult.get("secure_url").toString();
        log.info("Imagen cargada correctamente. URL: {}", url);

        return url;

    }

    /**
     * Elimina una imagen de Cloudinary utilizando su ID público.
     *
     * @param publicId El identificador público de la imagen en Cloudinary.
     */
    public void deleteImage(String publicId) {
        log.info("Eliminando imagen de Cloudinary con publicId: {}", publicId);
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Imagen eliminada con éxito.");
        } catch (IOException e) {
            log.error("No se pudo eliminar la imagen con publicId: {}", publicId, e);
        }
    }
}
