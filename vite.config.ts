import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      host: true,
      port: 3001,
      strictPort: true,
      allowedHosts: true,
      hmr: {
        host: env.VITE_HMR_HOST || undefined
      }
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        manifest: {
          name: 'Falajá',
          short_name: 'Falajá',
          start_url: '/',
          description: 'Fala Já - Transcrição Inteligente',
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          display_override: ['standalone', 'fullscreen'] as any[],
          orientation: 'portrait',
          scope: '/',
          icons: [
            {
              src: 'icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          id: '/',
          categories: ['productivity', 'utilities', 'business'],
          screenshots: [
            {
              src: 'screenshot1.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'wide'
            },
            {
              src: 'screenshot2.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'narrow'
            }
          ],
          shortcuts: [
            {
              name: 'Nova Transcrição',
              short_name: 'Nova',
              description: 'Gravar uma nova transcrição',
              url: '/?action=new',
              icons: [{ src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' }]
            }
          ],
          file_handlers: [
            {
              action: '/',
              accept: {
                'audio/mpeg': ['.mp3'],
                'audio/wav': ['.wav'],
                'audio/mp4': ['.m4a']
              }
            }
          ],
          share_target: {
            action: '/',
            method: 'POST',
            enctype: 'multipart/form-data',
            params: {
              title: 'title',
              text: 'text',
              url: 'url',
              files: [
                {
                  name: 'audio',
                  accept: ['audio/mpeg', 'audio/wav', 'audio/mp4', '.mp3', '.wav', '.m4a']
                }
              ]
            }
          },
          protocol_handlers: [
            {
              protocol: 'web+falaja',
              url: '/?url=%s'
            }
          ],
          launch_handler: {
            client_mode: ['navigate-existing', 'auto']
          },
          edge_side_panel: {
            preferred_width: 400
          },
          widgets: [
            {
              name: 'Fala Já Record',
              short_name: 'Record',
              description: 'Gravar rapidamente',
              tag: 'falaja-record',
              template_url: '/',
              type: 'application/json',
              icons: [{ src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' }]
            }
          ],
          note_taking: {
            new_note_url: '/?action=new'
          },
          dir: 'ltr',
          lang: 'pt-BR',
          prefer_related_applications: false,
          related_applications: [],
          iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
          scope_extensions: [
            { origin: 'https://*.falaja.ao' }
          ]
        } as any
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
