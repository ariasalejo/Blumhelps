package co.ariasalejo.blumhelps

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ExternalLinksTest {
    @Test
    fun acceptsHttpsLinksWithAHost() {
        assertTrue(isAllowedExternalUrl("https://www.gov.co/"))
        assertTrue(isAllowedExternalUrl(" https://example.org/path?q=1 "))
    }

    @Test
    fun rejectsNonHttpsSchemesAndMalformedLinks() {
        assertFalse(isAllowedExternalUrl("http://example.org"))
        assertFalse(isAllowedExternalUrl("javascript:alert(1)"))
        assertFalse(isAllowedExternalUrl("file:///etc/passwd"))
        assertFalse(isAllowedExternalUrl("not a url"))
        assertFalse(isAllowedExternalUrl(""))
    }

    @Test
    fun rejectsUrlsContainingEmbeddedCredentials() {
        assertFalse(isAllowedExternalUrl("https://user:password@example.org/"))
    }
}
