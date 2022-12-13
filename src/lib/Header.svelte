<svelte:options tag="hathi-website-header" />

<script>
  import { onMount } from 'svelte';
  import { slide, blur, fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

  import logo from '../assets/phire-htdl.png';

  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/alert/alert.js';
  import '@shoelace-style/shoelace/dist/components/icon/icon.js';
  import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
  import '@shoelace-style/shoelace/dist/components/menu/menu.js';
  import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';
  import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js';
  import '@shoelace-style/shoelace/dist/components/divider/divider.js';
  import '@shoelace-style/shoelace/dist/components/popup/popup.js';

  import '@shoelace-style/shoelace/dist/components/resize-observer/resize-observer.js';
  import '@shoelace-style/shoelace/dist/components/animation/animation.js';

  let assetPath = '';
  if ( window.HT ) {
    assetPath = new URL(document.querySelector('script[data-shoelace]').src);
    assetPath.pathname = '';
    assetPath = assetPath.toString();
  }

  let containerWidth = 2000;
  export let search_state = 'default';
  let searchFormDisplayed = ( search_state == 'default' );

  function displaySearchForm() {
    if ( search_state == 'default' ) {
      return true;
    } else if ( search_state == 'toggle' ) {
      return searchFormDisplayed;
    }
    return false;
  }

  function toggleSearch() {
    searchFormDisplayed = ! searchFormDisplayed;
  }

  // this data might be fetched
  export let menuData = {};
  menuData['about'] = [
    'Our Mission',
    'HathiTrust Research Center',
    'HathiTrust by the Numbers',
    'Our Team',
    'Careers',
  ];
  menuData['collection'] = [
    'About the Collection',
    'How to Search & Access',
    'How to Contribute Content',
    'Preservation',
    'Terms & Conditions',
  ]
  menuData['memberLibraries'] = [
    'Member List',
    'Services',
    'Collaborations',
    'Governance & Groups',
    'Member Groups'
  ]

  menuData['newsEvents'] = [
    'Perspectives',
    'Newsletters',
    'Events & Webinars'
  ]

  let resizeObserver;

  onMount(() => {
    resizeObserver.addEventListener('sl-resize', event => {
      let contentRect = event.detail.entries[0].contentRect;
      containerWidth = contentRect.width;
    });
  })

</script>

<style>
    :host {
      color: blue;
      --orange: #e67821;
    }

    *, *::after, *::before {
      box-sizing: border-box;
    }

    header {
      max-width: 1170px;
      margin: 1rem auto;
    }

    .menu {
      display: grid;
      gap: 1rem;
      align-items: center;
      grid-template: "logo nav actions" min-content / min-content 1fr max-content;
    }

    .logo {
      grid-area: logo;
      height: 60px;
    }

    nav.nav {
      grid-area: nav;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    nav.nav sl-button::part(base) {
      color: black;
      padding: 0;
    }

    nav.nav sl-button::part(base)::hover {
      color: orange;
      padding: 0;
      background: black;
    }

    nav.nav sl-button::part(label) {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }

    nav.actions {
      grid-area: actions;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    nav.actions sl-button[variant="text"]::part(base) {
      text-transform: uppercase;
      font-weight: bold;
      color: black;
      padding-inline-end: 0;
      padding: 0;
    }

    nav.actions sl-button[variant="text"]::part(label) {
      padding-left: 0.25rem;
      padding-right: 0.25rem;
    }

    nav.actions sl-button::part(suffix) {
      color: var(--orange);
    }

    #search-toggle::part(base) {
      text-transform: uppercase;
      font-weight: bold;
    }

    #search-toggle.active::part(base) {
      background: black;
      color: white;
    }

    :is(.alert) {
      margin: 1rem;
      padding: 1rem;
      background: black;
      border: 4px solid #666;
      border-radius: 8px;
      color: green;
      font-family: monospace;
    }
</style>

<sl-resize-observer bind:this={resizeObserver}>
  <header>
    <div class="menu">
      <a href="https://www.hathitrust.org" aria-label="Home">
        <img class="logo" alt="HathiTrust Digital Library" src={assetPath + logo} />
      </a>
      {#if containerWidth == 0}
        <div><sl-icon name="smartwatch"></sl-icon></div>
      {:else if containerWidth >= 1170}
        <nav class="nav">
          <sl-dropdown>
            <sl-button variant="text" slot="trigger" caret>About</sl-button>
            <sl-menu>
              {#each menuData.about as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
            </sl-menu>
          </sl-dropdown>
          <sl-dropdown>
            <sl-button variant="text" slot="trigger" caret>The Collection</sl-button>
            <sl-menu>
              {#each menuData.collection as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
            </sl-menu>
          </sl-dropdown>
          <sl-dropdown>
            <sl-button variant="text" slot="trigger" caret>Member Libraries</sl-button>
            <sl-menu>
              {#each menuData.memberLibraries as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
            </sl-menu>
          </sl-dropdown>
          <sl-button variant="text">Join Us</sl-button>
          <sl-dropdown>
            <sl-button variant="text" slot="trigger" caret>News & Events</sl-button>
            <sl-menu>
              {#each menuData.newsEvents as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
            </sl-menu>
          </sl-dropdown>
        </nav>
      {:else}
        <nav class="nav-compact">
          <sl-dropdown>
            <sl-button slot="trigger">
              Menu
              <sl-icon slot="suffix" name="list"></sl-icon>
            </sl-button>
            <sl-menu>
              <sl-menu-label>About</sl-menu-label>
              {#each menuData.about as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
              <sl-divider></sl-divider>
              <sl-menu-label>The Collection</sl-menu-label>
              {#each menuData.collection as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
              <sl-divider></sl-divider>
              <sl-menu-label>Member Libraries</sl-menu-label>
              {#each menuData.memberLibraries as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
              <sl-divider></sl-divider>
              <sl-menu-item>Join Us</sl-menu-item>
              <sl-divider></sl-divider>
              <sl-menu-label>News & Events</sl-menu-label>
              {#each menuData.newsEvents as linkText}
              <sl-menu-item>{linkText}</sl-menu-item>
              {/each}
            </sl-menu>
        </nav>
      {/if}
      <nav class="actions">
        {#if search_state == 'toggle'}
          <sl-button id="search-toggle" class:active={searchFormDisplayed} variant="warning" on:click={toggleSearch}>Search</sl-button>
        {/if}
        <sl-button variant="text">
          Get Help
          <sl-icon slot="suffix" name="arrow-up-right-square-fill"></sl-icon>
        </sl-button>
        <sl-button variant="text">
          Log In
          <sl-icon slot="suffix" name="person-fill"></sl-icon>
        </sl-button>
      </nav>
    </div>
  </header>
</sl-resize-observer>
{#if search_state == 'default'}
  <hathi-search-form></hathi-search-form>
{:else if search_state == 'toggle'}
  <!-- transition:blur|local="{{ amount: 10 }}"-->
  <!-- transition:slide="{{delay: 50, duration: 300, easing: quintOut }}" -->
  <div out:slide>
    <hathi-search-form data-wtf={typeof(searchFormDisplayed)} display={searchFormDisplayed}></hathi-search-form>
  </div>
{/if}
