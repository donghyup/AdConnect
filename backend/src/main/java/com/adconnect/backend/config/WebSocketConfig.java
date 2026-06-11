package com.adconnect.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register client connection endpoint
        registry.addEndpoint("/ws-adconnect")
                .setAllowedOriginPatterns("*"); // Allow CORS from any origin
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix for clients to subscribe to channels (e.g. /topic/rooms/{id})
        registry.enableSimpleBroker("/topic");
        // Prefix for clients to send messages to backend STOMP handlers (e.g. /app/chat/send)
        registry.setApplicationDestinationPrefixes("/app");
    }
}
