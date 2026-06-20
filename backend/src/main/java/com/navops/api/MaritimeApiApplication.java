package com.navops.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MaritimeApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(MaritimeApiApplication.class, args);
	}

}
