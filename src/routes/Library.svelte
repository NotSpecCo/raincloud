<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import MdAlbum from 'svelte-icons/md/MdAlbum.svelte';
  import MdAudiotrack from 'svelte-icons/md/MdAudiotrack.svelte';
  import MdPerson from 'svelte-icons/md/MdPerson.svelte';
  import MdPlaylistPlay from 'svelte-icons/md/MdPlaylistPlay.svelte';
  import MdWifiTethering from 'svelte-icons/md/MdWifiTethering.svelte';
  import { push } from 'svelte-spa-router';

  registerView({});

  const items: any = [
    {
      id: 'tracks',
      icon: MdAudiotrack,
      title: 'Tracks',
    },
    {
      id: 'playlists',
      icon: MdPlaylistPlay,
      title: 'Playlists',
    },
    {
      id: 'albums',
      icon: MdAlbum,
      title: 'Albums',
    },
    {
      id: 'stations',
      icon: MdWifiTethering,
      title: 'Stations',
    },
    {
      id: 'following',
      icon: MdPerson,
      title: 'Following',
    },
    {
      id: 'mytracks',
      icon: MdAudiotrack,
      title: 'Tracks',
    },
    {
      id: 'myplaylists',
      icon: MdPlaylistPlay,
      title: 'Playlists',
    },
  ];

  onMount(() => {
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Library" />
      <CardContent>
        <Divider title="Likes" />
        {#each items.slice(0, 5) as item, i}
          <ListItem
            icon={item.icon}
            primaryText={item.title}
            navi={{
              itemId: `${i + 1}`,
              shortcutKey: getShortcutFromIndex(i),
              onSelect: () => push(`/library/${item.id}`),
            }}
          />
        {/each}
        <Divider title="My Stuff" />
        {#each items.slice(5) as item, i}
          <ListItem
            icon={item.icon}
            primaryText={item.title}
            navi={{
              itemId: `${i + 6}`,
              shortcutKey: getShortcutFromIndex(i + 5),
              onSelect: () => push(`/library/${item.id}`),
            }}
          />
        {/each}
      </CardContent>
    </Card>
  </ViewContent>
</View>
