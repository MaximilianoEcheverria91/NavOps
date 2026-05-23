package com.navops.api.infrastructure.controller;

import com.navops.api.application.service.ImageStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Imágenes", description = "EndPoint para la carga genérica de imágenes a Cloudinary")
public class ImageController {

    private final ImageStorageService imageStorageService;

    @Operation(summary = "Sube una imagen a Cloudinary.", description = "Espera un archivo MultipartFile y una cadena para el nombre de la carpeta (por ejemplo, 'profile_pictures', 'ships', etc.). Devuelve la URL segura.")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        
        try {
            String url = imageStorageService.uploadImage(file, folder);
            return ResponseEntity.ok(new UploadResponse(url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Java 21 Record for clean JSON response
    public record UploadResponse(String url) {}
}
