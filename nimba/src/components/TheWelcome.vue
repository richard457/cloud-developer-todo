<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Why?</template>

    Publisher’s
    <a href="#" target="_blank" rel="noopener">Our</a>
    provides you with all support you need to get your journal published and review from our trusted professors.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Reviews</template>

    Whether you want to receive review via email or whatsapp we got you covered
    <a href="mailto:info@yegobox.com" target="_blank" rel="noopener">Email</a>. The
    We just want to make your life easier
    <a href="mailto:info@yegobox.com" target="_blank" rel="noopener">WhatsApp</a> +


    <br />

    More instructions are available in <code>Are provided on choosen communication channel</code>.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and support you need to get your journal published:

    <a href="https://yegobox.com/policy" target="_blank" rel="noopener">Policy</a>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Obtain access to the list of scholars and the professors' community
    <a href="#" target="_blank" rel="noopener">our mailing list</a> and follow
    the official
    <a href="https://twitter.com/yegobox" target="_blank" rel="noopener">@yegobox</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Publicher's Academy</template>

    As we aim to make the life of the publisher around, Publisher Academy relies on community backing for its
    sustainability.
    <a href="mailto:info@yegobox.com" target="_blank" rel="noopener">becoming a sponsor</a>.
  </WelcomeItem>
</template>
