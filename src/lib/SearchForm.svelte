<svelte:options tag="hathi-search-form" />

<script>
  import { onMount } from 'svelte';

  import '@shoelace-style/shoelace/dist/components/button/button.js';
  import '@shoelace-style/shoelace/dist/components/icon/icon.js';
  import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js';

  import '@shoelace-style/shoelace/dist/components/input/input.js';
  import '@shoelace-style/shoelace/dist/components/select/select.js';

  export let index = 'library';
  export let display = 'true';

  let _select, _searchtype, _root, fieldValue, _input;
  fieldValue = 'Everything';

  function _updateSearchType() {
    let value = _searchtype.value;
    _root.dataset.field = value;
    // let menuItem = _searchtype.querySelector(`sl-menu-item[value="${value}"]`);
    let menuItem = _searchtype.querySelector(`sl-menu-item[aria-checked="true"]`);
    window._s1 = _searchtype;
    console.log("-- updateSearchType", value, _searchtype, menuItem);
    fieldValue = menuItem.getTextLabel();
  }


  let SERVICE_DOMAIN = 'babel.hathitrust.org';
  let CATALOG_DOMAIN = 'catalog.hathitrust.org';
  if ( window.HT && window.HT.service_domain ) {
    SERVICE_DOMAIN = window.HT.service_domain;
    CATALOG_DOMAIN = window.HT.catalog_domain;
  }

  let searchParams = new URLSearchParams(location.search);

  // seed from the URL
  if ( searchParams.has('lookfor') ) {
    _input.value = searchParams.get('lookfor');
    let searchtype = searchParams.get('searchtype')  || 'all';
    _searchtype.value = searchtype;
  } else if ( searchParams.has('q1') ) {
    _input.value = searchParams.get('q1');
    _searchtype.value = 'everything';
  }

  let _updateSelect = function(event) {
    _root.dataset.index = event.target.value;
    index = event.target.value;
  }

  let _submitSearch = function(event) {
    let search_url;
    if ( index == 'library' && _searchtype.value == 'everything' ) {
      let submitData = new URLSearchParams();
      submitData.set('q1', _input.value);
      submitData.set('field1', 'ocr');
      submitData.set('a', 'srchls');
      submitData.set('ft', 'ft');
      submitData.set('lmt', 'ft');
      search_url = `//${SERVICE_DOMAIN}/cgi/ls?${submitData.toString()}`;
    } else if ( this.index == 'library' ) {
      let submitData = new URLSearchParams();
      submitData.set('lookfor', _input.value);
      submitData.set('searchtype', _searchtype.value);
      submitData.set('ft', 'ft');
      submitData.set('setft', 'true');
      search_url = `//${CATALOG_DOMAIN}/Search/Home?${submitData.toString()}`;
    } else {
      // website search
      let searchTerms = _input.value.toLowerCase();
      search_url = `https://www.hathitrust.org/search/node/${searchTerms}`
    }
    if ( search_url ) {
      location.href = search_url;
    }
  }

  onMount(() => {
    // take it off the main thread so the sl-selects build themselves
    setTimeout(() => {
      _updateSearchType();
    }, 0);
  })

  let expanded = ( display.toString() == 'true' );
  
  function setExpanded(value) {
    expanded = ( value.toString() == 'true' );
  }

  let original = display;

  // $: expanded = ( display == 'true' );
  $: setExpanded(display);
  
</script>

<style>
  .search-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    max-width: 1170px;
    margin: 1rem auto;
    overflow: hidden;
    max-height: 0px;
    transition:max-height 0.3s ease-out;
  }

  .search-form.expanded {
    max-height: 6rem;
  }

  .search-form > form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: auto;

    gap: 0rem;

    font-size: 1rem;
    font-family: sans-serif;

    width: 100%;
  }

  .search-form > form > * + * {
    border-left: 0px;
  }

  .search-form sl-input::part(base) {
    --sl-input-border-radius-large: 8px;
    --sl-input-font-size-large: 1rem;

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

  }

  sl-select[data-action="searchtype"] {
    min-width: 30ch;
  }

  .search-form sl-select::part(base) {
    --sl-input-border-radius-large: 0;
    --sl-input-font-size-large: 1rem;
  }

  sl-button[data-action="search"]::part(base) {

    --sl-input-border-width: 1px;

    background: #e87821;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    border: 1px solid #e87821;

    display: flex;
    align-items: center;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  sl-input#q1 {
    flex-grow: 1;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .search-form form label {
    display: none;
  }

  .search-links {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    width: 98%;
    margin-left: auto;
    margin-right: auto;
  }

  .search-links > div {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1.5rem;
  }

  .search-links a {
    color: black;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    text-decoration: none;
  }

  /* .search-form[data-view="full"] *[data-index-view="full"] {
    display: block;
  } */

  span.hint {
    color: #888;
  }
</style>

<div aria-hidden={!expanded} data-expanded={expanded} data-search-state={display} class="search-form" class:expanded={expanded} data-index="library" data-field="everything" bind:this={_root}>
  <form>
    <label for="q1">Search the </label>
    <sl-input id="q1" size="large" placeholder="Type something" bind:this={_input}></sl-input>
    <sl-select value="library" size="large" data-action="select" bind:this={_select} on:sl-change={_updateSelect}>
      <sl-menu-item data-view="full" value="library">Collection</sl-menu-item>
      <sl-menu-item value="website">Website</sl-menu-item>
    </sl-select>
    {#if index == 'library'}
    <label for="index" data-index="library"> by </label>
    <sl-select id="index" data-index="library" data-action="searchtype" value="everything" size="large" bind:this={_searchtype} on:sl-change={_updateSearchType}>
      <sl-menu-item value="everything">Everything</sl-menu-item>
      <sl-menu-item value="all">All Bibliographic Fields</sl-menu-item>
      <sl-menu-item value="title">Title</sl-menu-item>
      <sl-menu-item value="author">Author</sl-menu-item>
      <sl-menu-item value="subject">Subject</sl-menu-item>
      <sl-menu-item value="isbn">ISBN/ISSN</sl-menu-item>
      <sl-menu-item value="publisher">Publisher</sl-menu-item>
      <sl-menu-item value="seriestitle">Series Title</sl-menu-item>
    </sl-select>
    {/if}
    <sl-button data-action="search" size="large" on:click={_submitSearch}>Search</sl-button>
  </form>
  <div class="search-links">
    {#if index == 'library'}
    <span class="hint" data-index="library">
      You're searching in <span data-target="field">{fieldValue}</span> for items you can access.
    </span>
    {/if}
    {#if index == 'website'}
    <span class="hint" data-index="website">
      You're searching the information website.
    </span>
    {/if}
    <div>
      <a href="#">
        <sl-icon name="question-circle"></sl-icon>
        Search Help
      </a>
      <a href="/Search/Advanced">
        <sl-icon name="search"></sl-icon>
        Advanced Collection Search
      </a>
    </div>
  </div>
</div>