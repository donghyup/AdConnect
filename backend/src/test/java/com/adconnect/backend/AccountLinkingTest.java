package com.adconnect.backend;

import com.adconnect.backend.entity.User;
import com.adconnect.backend.repository.UserRepository;
import com.adconnect.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Boots the real Spring context + H2 DB and exercises the actual account-linking
 * logic (UserService.getOrCreateSocialUser + the new findBy*Email repository
 * queries) against a real database. The OAuth HTTP exchange is provider-side and
 * unreachable in a test, so this drives the service boundary that the OAuth
 * controllers call right after resolving (provider, providerId, email, name).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("h2")
@TestPropertySource(properties = {
        "emailjs.service-id=test",
        "emailjs.template-id=test",
        "emailjs.public-key=test",
        "emailjs.private-key=test"
})
class AccountLinkingTest {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void clearDb() {
        userRepository.deleteAll();
    }

    @Test
    void linkedSocialAccountsResolveToSameUser() {
        // 1. Login via Kakao -> creates account A, kakaoEmail auto-set
        User a = userService.getOrCreateSocialUser("kakao", "K1", "kuser@kakao.com", "카카오유저");
        assertNotNull(a.getId());
        assertEquals("kuser@kakao.com", a.getKakaoEmail(), "kakao login should set kakaoEmail");

        // 2. In My Page, link a Google and a Naver email to this Kakao account
        userService.updateSocialLinks("kuser@kakao.com", "google", "myreal@gmail.com");
        userService.updateSocialLinks("kuser@kakao.com", "naver", "myreal@naver.com");

        // 3. Log in via the linked Google account -> must resolve to account A
        User viaGoogle = userService.getOrCreateSocialUser("google", "G1", "myreal@gmail.com", "구글유저");
        assertEquals(a.getId(), viaGoogle.getId(),
                "Google login with a linked email must resolve to the same account");
        assertEquals("kuser@kakao.com", viaGoogle.getKakaoEmail(), "Kakao link must remain visible");
        assertEquals("myreal@naver.com", viaGoogle.getNaverEmail(), "Naver link must remain visible");
        assertEquals("myreal@gmail.com", viaGoogle.getGoogleEmail(), "Google link must be present");

        // 4. Log in via the linked Naver account -> must resolve to account A too
        User viaNaver = userService.getOrCreateSocialUser("naver", "N1", "myreal@naver.com", "네이버유저");
        assertEquals(a.getId(), viaNaver.getId(),
                "Naver login with a linked email must resolve to the same account");

        // 5. No duplicate accounts must have been created
        assertEquals(1, userRepository.count(), "exactly one account should exist (no duplicates)");
    }

    @Test
    void unlinkedSocialLoginStillCreatesSeparateAccount() {
        userService.getOrCreateSocialUser("kakao", "K9", "solo@kakao.com", "단독카카오");
        // A google login whose email is NOT linked anywhere must create its own account
        User g = userService.getOrCreateSocialUser("google", "G9", "stranger@gmail.com", "낯선구글");
        assertEquals("google", g.getProvider());
        assertEquals(2, userRepository.count(), "an unrelated social login should create a new account");
    }
}
