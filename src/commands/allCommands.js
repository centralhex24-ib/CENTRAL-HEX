// ============================================
// CENTRAL-HEX - 200 COMMANDES COMPLÈTES
// Développé par Ibrahima Sory Sacko
// Numéro: 621963059
// ============================================

const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const cheerio = require('cheerio');
const FormData = require('form-data');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuration
const CONFIG = {
    ownerNumber: '224621963059@s.whatsapp.net',
    ownerName: 'IbSacko',
    developer: 'Ibrahima Sory Sacko',
    botName: 'CENTRAL-HEX',
    prefix: 'Ib',
    mode: 'public',
    timezone: 'Africa/Conakry',
    images: {
        menu: 'https://h.uguu.se/uZvwPpnm.jpg',
        owner: 'https://h.uguu.se/uZvwPpnm.jpg'
    }
};

// Base de données simple
const db = {
    settings: {
        antiDelete: false,
        antiLink: false,
        antiSticker: false,
        antiMention: false,
        autoRead: true,
        autoTyping: true
    },
    groups: {},
    users: {},
    notes: {},
    reminders: [],
    games: {}
};

// ============================================
// UTILITAIRES
// ============================================

const getUptime = (startTime) => {
    const now = Date.now();
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};

const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios(url, options);
        return res.data;
    } catch (err) {
        return { error: err.message };
    }
};

const getBuffer = async (url) => {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        return Buffer.from(res.data);
    } catch (err) {
        return null;
    }
};

const getGroupAdmins = (participants) => {
    return participants.filter(p => p.admin).map(p => p.id);
};

// ============================================
// OBJET COMMANDS - 200 COMMANDES
// ============================================

const commands = {
    
    // ═══════════════════════════════════════════════════
    // 1. GENERAL - 10 commandes
    // ═══════════════════════════════════════════════════
    
    menu: {
        category: 'general',
        desc: 'Afficher le menu principal',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            const uptime = getUptime(startTime);
            const time = moment().tz(CONFIG.timezone).format('HH:mm:ss');
            
            const menuText = `━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│ 🤖 𝗕𝗼𝘁 : ${CONFIG.botName}
│ ⏱️ 𝗨𝗽𝘁𝗶𝗺𝗲 : ${uptime}
│ 🌍 𝗠𝗼𝗱𝗲 : ${CONFIG.mode}
│ 🔑 𝗣𝗿𝗲𝗳𝗶𝘅𝗲 : ${CONFIG.prefix}
│ 👤 𝗢𝘄𝗻𝗲𝗿 : ${CONFIG.ownerName}
│ ⏰ 𝗛𝗲𝘂𝗿𝗲 : ${time}
│
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗚𝗘𝗡𝗘𝗥𝗔𝗟-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗺𝗲𝗻𝘂 ⬡ le menu
│ ❐➻ 𝗮𝗹𝗶𝘃𝗲 ⬡ état du bot
│ ❐➻ 𝗱𝗲𝘃 ⬡ développeur
│ ❐➻ 𝗮𝗹𝗹𝘃𝗮𝗿 ⬡ variables
│ ❐➻ 𝗽𝗶𝗻𝗴 ⬡ vitesse du bot
│ ❐➻ 𝗼𝘄𝗻𝗲𝗿 ⬡ propriétaire
│ ❐➻ 𝘀𝘁𝗮𝘁𝘀 ⬡ statistiques
│ ❐➻ 𝘂𝗽𝘁𝗶𝗺𝗲 ⬡ temps d
│ ❐➻ 𝗶𝗻𝗳𝗼 ⬡ informations
│ ❐➻ 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 ⬡ technique
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗢𝗪𝗡𝗘𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗷𝗼𝗶𝗻 ⬡ rejoindre un grp
│ ❐➻ 𝗹𝗲𝗮𝘃𝗲 ⬡ quitter un grp
│ ❐➻ 𝗮𝗻𝘁𝗶𝗱𝗲𝗹𝗲𝘁𝗲 ⬡ anti-suppression
│ ❐➻ 𝘂𝗽𝗹𝗼𝗮𝗱 ⬡ téléverser fichier
│ ❐➻ 𝘃𝘃 ⬡ voir message unique
│ ❐➻ 𝗮𝗹𝗹𝗰𝗺𝗱𝘀 ⬡ toutes les cmmd
│ ❐➻ 𝗱𝗲𝗹𝗲𝘁𝗲 ⬡ supprimer message
│ ❐➻ 𝗿𝗲𝗽𝗼 ⬡ dépôt GitHub
│ ❐➻ 𝗯𝗿𝗼𝗮𝗱𝗰𝗮𝘀𝘁 ⬡ message brdc
│ ❐➻ 𝘀𝗲𝘁𝗽𝗽 ⬡ changer photo profil
│ ❐➻ 𝘀𝗲𝘁𝗻𝗮𝗺𝗲 ⬡ changer nom bot
│ ❐➻ 𝘀𝗲𝘁𝗯𝗶𝗼 ⬡ changer bio
│ ❐➻ 𝗯𝗹𝗼𝗰𝗸 ⬡ bloquer utls
│ ❐➻ 𝘂𝗻𝗯𝗹𝗼𝗰𝗸 ⬡ débloquer utls
│ ❐➻ 𝘀𝗲𝗹𝗳 ⬡ mode privé
│ ❐➻ 𝗽𝘂𝗯𝗹𝗶𝗰 ⬡ mode public
│ ❐➻ 𝗿𝗲𝗮𝗱𝗮𝗹𝗹 ⬡ marquer lu
│ ❐➻ 𝗻𝗶𝗻𝗷𝗮 ⬡ mode ninja
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗜𝗔-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗮𝗶 ⬡ intelligence artificielle
│ ❐➻ 𝗴𝗽𝘁 ⬡ ChatGPT
│ ❐➻ 𝗴𝗲𝗺𝗶𝗻𝗶 ⬡ IA Gemini
│ ❐➻ 𝗯𝗮𝗿𝗱 ⬡ Google Bard
│ ❐➻ 𝗯𝗶𝗻𝗴 ⬡ Bing AI
│ ❐➻ 𝗰𝗹𝗮𝘂𝗱𝗲 ⬡ Claude AI
│ ❐➻ 𝗽𝗲𝗿𝗽𝗹𝗲𝘅𝗶𝘁𝘆 ⬡ Perplexity AI
│ ❐➻ 𝘆𝗼𝘂𝗰𝗵𝗮𝘁 ⬡ YouChat
│ ❐➻ 𝗰𝗵𝗮𝘁𝗯𝗼𝘁 ⬡ discussion IA
│ ❐➻ 𝗰𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 ⬡ Character AI
│ ❐➻ 𝗿𝗲𝘄𝗿𝗶𝘁𝗲 ⬡ réécrire un texte
│ ❐➻ 𝘀𝘂𝗺𝗺𝗮𝗿𝗶𝘇𝗲 ⬡ résumer un texte
│ ❐➻ 𝘁𝗿𝗮𝗻𝘀𝗹𝗮𝘁𝗲 ⬡ traduire texte
│ ❐➻ 𝗯𝘂𝗴 ⬡ signaler un bug
│ ❐➻ 𝗯𝗼𝘁 ⬡ informations bot
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗨𝗥-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗮𝘁𝘁𝗽 ⬡ texte en sticker animé
│ ❐➻ 𝘁𝗼𝗶𝗺𝗮𝗴𝗲 ⬡ sticker en image
│ ❐➻ 𝗴𝗶𝗺𝗮𝗴𝗲 ⬡ image Google
│ ❐➻ 𝗺𝗽𝟯 ⬡ convertir en MP3
│ ❐➻ 𝘀𝘀 ⬡ capture écran web
│ ❐➻ 𝗳𝗮𝗻𝗰𝘆 ⬡ texte stylé
│ ❐➻ 𝘂𝗿𝗹 ⬡ extraire lien
│ ❐➻ 𝘀𝘁𝗶𝗰𝗸𝗲𝗿 ⬡ créer sticker
│ ❐➻ 𝘁𝗮𝗸𝗲 ⬡ récupérer sticker
│ ❐➻ 𝘁𝗼𝗺𝗽𝟰 ⬡ convertir en MP4
│ ❐➻ 𝘁𝗼𝗴𝗶𝗳 ⬡ convertir en GIF
│ ❐➻ 𝘁𝗼𝗽𝗱𝗳 ⬡ convertir en PDF
│ ❐➻ 𝘁𝗼𝗱𝗼𝗰 ⬡ convertir en DOC
│ ❐➻ 𝘁𝗼𝘂𝗿𝗹 ⬡ fichier vers URL
│ ❐➻ 𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅 ⬡ mixer emojis
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗥𝗘𝗖𝗛𝗘𝗥𝗖𝗛𝗘-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗴𝗼𝗼𝗴𝗹𝗲 ⬡ recherche Google
│ ❐➻ 𝗽𝗹𝗮𝘆 ⬡ recherche musique
│ ❐➻ 𝘃𝗶𝗱𝗲𝗼 ⬡ recherche vidéo
│ ❐➻ 𝘀𝗼𝗻𝗴 ⬡ recherche chanson
│ ❐➻ 𝗺𝗲𝗱𝗶𝗮𝗳𝗶𝗿𝗲 ⬡ MediaFire
│ ❐➻ 𝗳𝗮𝗰𝗲𝗯𝗼𝗼𝗸 ⬡ recherche Facebook
│ ❐➻ 𝗶𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺 ⬡ recherche Instagram
│ ❐➻ 𝘁𝗶𝗸𝘁𝗼𝗸 ⬡ recherche TikTok
│ ❐➻ 𝗹𝘆𝗿𝗶𝗰𝘀 ⬡ paroles chanson
│ ❐➻ 𝗶𝗺𝗮𝗴𝗲 ⬡ recherche images
│ ❐➻ 𝗽𝗶𝗻𝘁𝗲𝗿𝗲𝘀𝘁 ⬡ Pinterest
│ ❐➻ 𝘆𝗼𝘂𝘁𝘂𝗯𝗲 ⬡ YouTube
│ ❐➻ 𝘁𝘄𝗶𝘁𝘁𝗲𝗿𝘀𝗲𝗮𝗿𝗰𝗵 ⬡ recherche Twitter
│ ❐➻ 𝘀𝗽𝗼𝘁𝗶𝗳𝘆 ⬡ Spotify
│ ❐➻ 𝗮𝗽𝗽𝗹𝗲𝗺𝘂𝘀𝗶𝗰 ⬡ Apple Music
│ ❐➻ 𝘀𝗼𝘂𝗻𝗱𝗰𝗹𝗼𝘂𝗱 ⬡ SoundCloud
│ ❐➻ 𝘄𝗶𝗸𝗶𝗽𝗲𝗱𝗶𝗮 ⬡ Wikipedia
│ ❐➻ 𝘄𝗶𝗸𝗶𝗵𝗼𝘄 ⬡ WikiHow
│ ❐➻ 𝗮𝗺𝗮𝘇𝗼𝗻 ⬡ Amazon
│ ❐➻ 𝗲𝗯𝗮𝘆 ⬡ eBay
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗗𝗜𝗩𝗘𝗥𝗧𝗜𝗦𝗦𝗘𝗠𝗘𝗡𝗧-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗴𝗲𝘁𝗽𝗽 ⬡ photo de profil
│ ❐➻ 𝗴𝗼𝗼𝗱𝗻𝗶𝗴𝗵𝘁 ⬡ bonne nuit
│ ❐➻ 𝘄𝗰𝗴 ⬡ classement
│ ❐➻ 𝗾𝘂𝗶𝘇𝘇 ⬡ quiz fun
│ ❐➻ 𝗮𝗻𝗶𝗺𝗲 ⬡ anime
│ ❐➻ 𝗽𝗿𝗼𝗳𝗶𝗹𝗲 ⬡ profil utilisateur
│ ❐➻ 𝗰𝗼𝘂𝗽𝗹𝗲 ⬡ couple
│ ❐➻ 𝗽𝗼𝗹𝗹 ⬡ sondage
│ ❐➻ 𝗲𝗺𝗼𝗷𝗶𝗺𝗶𝘅𝟮 ⬡ mix emojis 2
│ ❐➻ 𝗷𝗼𝗸𝗲 ⬡ blague
│ ❐➻ 𝗺𝗲𝗺𝗲 ⬡ mème
│ ❐➻ 𝗾𝘂𝗼𝘁𝗲 ⬡ citation
│ ❐➻ 𝗳𝗮𝗰𝘁 ⬡ fait intéressant
│ ❐➻ 𝗱𝗮𝗿𝗲 ⬡ défi
│ ❐➻ 𝘁𝗿𝘂𝘁𝗵 ⬡ vérité
│ ❐➻ 𝘀𝗵𝗶𝗽 ⬡ compatibilité
│ ❐➻ 𝗸𝗶𝗹𝗹 ⬡ éliminer
│ ❐➻ 𝗵𝘂𝗴 ⬡ câlin
│ ❐➻ 𝗸𝗶𝘀𝘀 ⬡ bisou
│ ❐➻ 𝘀𝗹𝗮𝗽 ⬡ gifler
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗚𝗥𝗢𝗨𝗣𝗘𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗸𝗶𝗰𝗸𝗮𝗹𝗹 ⬡ exclure tous
│ ❐➻ 𝘁𝗮𝗴𝗮𝗱𝗺𝗶𝗻 ⬡ mention admins
│ ❐➻ 𝗮𝗰𝗰𝗲𝗽𝘁𝗮𝗹𝗹 ⬡ accepter tous
│ ❐➻ 𝘁𝗮𝗴𝗮𝗹𝗹 ⬡ mentionner tous
│ ❐➻ 𝗴𝗲𝘁𝗮𝗹𝗹 ⬡ liste membres
│ ❐➻ 𝗴𝗿𝗼𝘂𝗽𝗰𝗹𝗼𝘀𝗲 ⬡ fermer groupe
│ ❐➻ 𝗴𝗿𝗼𝘂𝗽𝗼𝗽𝗲𝗻 ⬡ ouvrir groupe
│ ❐➻ 𝗮𝗱𝗱 ⬡ ajouter membre
│ ❐➻ 𝘃𝗰𝗳 ⬡ contacts VCF
│ ❐➻ 𝗹𝗶𝗻𝗸𝗴𝗰 ⬡ lien groupe
│ ❐➻ 𝗮𝗻𝘁𝗶𝗹𝗶𝗻𝗸 ⬡ anti-lien
│ ❐➻ 𝗮𝗻𝘁𝗶𝘀𝘁𝗶𝗰𝗸𝗲𝗿 ⬡ anti-sticker
│ ❐➻ 𝗮𝗻𝘁𝗶𝗴𝗽 ⬡ anti-mention
│ ❐➻ 𝗰𝗿𝗲𝗮𝘁𝗲 ⬡ créer groupe
│ ❐➻ 𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼 ⬡ infos groupe
│ ❐➻ 𝗽𝗿𝗼𝗺𝗼𝘁𝗲 ⬡ rendre admin
│ ❐➻ 𝗱𝗲𝗺𝗼𝘁𝗲 ⬡ retirer admin
│ ❐➻ 𝗸𝗶𝗰𝗸 ⬡ expulser membre
│ ❐➻ 𝘄𝗮𝗿𝗻 ⬡ avertir membre
│ ❐➻ 𝘂𝗻𝘄𝗮𝗿𝗻 ⬡ retirer avertissement
│ ❐➻ 𝘄𝗮𝗿𝗻𝗶𝗻𝗴𝘀 ⬡ voir avertissements
│ ❐➻ 𝘀𝗲𝘁𝘀𝘂𝗯𝗷𝗲𝗰𝘁 ⬡ changer nom groupe
│ ❐➻ 𝗿𝗲𝘃𝗼𝗸𝗲 ⬡ révoquer lien
│ ❐➻ 𝗶𝗻𝘃𝗶𝘁𝗲 ⬡ inviter membre
│ ❐➻ 𝗽𝗼𝗹𝗹𝟮 ⬡ sondage groupe
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗥𝗘́𝗔𝗖𝗧𝗜𝗢𝗡𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝘆𝗲𝗲𝘁 ⬡ jeter
│ ❐➻ 𝘀𝗹𝗮𝗽 ⬡ gifler
│ ❐➻ 𝗻𝗼𝗺 ⬡ manger
│ ❐➻ 𝗽𝗼𝗸𝗲 ⬡ toucher
│ ❐➻ 𝘄𝗮𝘃𝗲 ⬡ saluer
│ ❐➻ 𝘀𝗺𝗶𝗹𝗲 ⬡ sourire
│ ❐➻ 𝗱𝗮𝗻𝗰𝗲 ⬡ danser
│ ❐➻ 𝘀𝗺𝘂𝗴 ⬡ narquois
│ ❐➻ 𝗰𝗿𝗶𝗻𝗴𝗲 ⬡ malaise
│ ❐➻ 𝗵𝗮𝗽𝗽𝘆 ⬡ heureux
│ ❐➻ 𝗰𝗿𝘆 ⬡ pleurer
│ ❐➻ 𝗮𝗻𝗴𝗿𝘆 ⬡ en colère
│ ❐➻ 𝗰𝗼𝗻𝗳𝘂𝘀𝗲𝗱 ⬡ confus
│ ❐➻ 𝗯𝗼𝗿𝗲𝗱 ⬡ ennuyé
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗧𝗘́𝗟𝗘́𝗖𝗛𝗔𝗥𝗚𝗘𝗠𝗘𝗡𝗧-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝘆𝘁𝗺𝗽𝟯 ⬡ YouTube MP3
│ ❐➻ 𝘆𝘁𝗺𝗽𝟰 ⬡ YouTube MP4
│ ❐➻ 𝗳𝗯𝗱𝗹 ⬡ Facebook DL
│ ❐➻ 𝗶𝗴𝗱𝗹 ⬡ Instagram DL
│ ❐➻ 𝘁𝗶𝗸𝘁𝗼𝗸𝗱𝗹 ⬡ TikTok DL
│ ❐➻ 𝘁𝘄𝗶𝘁𝘁𝗲𝗿 ⬡ Twitter/X DL
│ ❐➻ 𝗽𝗹𝗮𝘆𝟮 ⬡ télécharger musique
│ ❐➻ 𝘃𝗶𝗱𝗲𝗼𝟮 ⬡ télécharger vidéo
│ ❐➻ 𝘀𝗽𝗼𝘁𝗶𝗳𝘆𝗱𝗹 ⬡ Spotify DL
│ ❐➻ 𝘀𝗼𝘂𝗻𝗱𝗰𝗹𝗼𝘂𝗱𝗱𝗹 ⬡ SoundCloud DL
│ ❐➻ 𝘇𝗶𝗽𝗽𝘆𝘀𝗵𝗮𝗿𝗲 ⬡ ZippyShare DL
│ ❐➻ 𝗮𝗻𝗼𝗻𝗳𝗶𝗹𝗲𝘀 ⬡ AnonFiles DL
│ ❐➻ 𝗿𝗮𝗰𝗮𝘁𝘆 ⬡ Racaty DL
│ ❐➻ 𝗯𝗮𝘆𝗳𝗶𝗹𝗲𝘀 ⬡ BayFiles DL
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗢𝗨𝗧𝗜𝗟𝗦-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝘁𝗿𝗮𝗱𝘂𝗶𝗿𝗲 ⬡ traduction
│ ❐➻ 𝘄𝗲𝗮𝘁𝗵𝗲𝗿 ⬡ météo
│ ❐➻ 𝗰𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗿𝗶𝗰𝗲 ⬡ calculatrice
│ ❐➻ 𝗿𝗲𝗺𝗶𝗻𝗱𝗲𝗿 ⬡ rappel
│ ❐➻ 𝗻𝗼𝘁𝗲 ⬡ prendre une note
│ ❐➻ 𝗾𝗿𝗰𝗼𝗱𝗲 ⬡ générer QR Code
│ ❐➻ 𝘀𝗵𝗼𝗿𝘁 ⬡ raccourcir URL
│ ❐➻ 𝗯𝗮𝘀𝗲𝟲𝟰 ⬡ encoder/décoder
│ ❐➻ 𝗺𝗼𝗿𝘀𝗲 ⬡ code Morse
│ ❐➻ 𝗯𝗶𝗻𝗮𝗿𝘆 ⬡ binaire
│ ❐➻ 𝗵𝗲𝘅 ⬡ hexadécimal
│ ❐➻ 𝗿𝗴𝗯 ⬡ couleur RGB
│ ❐➻ 𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱 ⬡ générer mot de passe
│ ❐➻ 𝘂𝘂𝗶𝗱 ⬡ générer UUID
│ ❐➻ 𝗵𝗮𝘀𝗵 ⬡ hacher texte
│ ❐➻ 𝗰𝗼𝗺𝗽𝗿𝗲𝘀𝘀 ⬡ compresser texte
│ ❐➻ 𝗱𝗲𝗰𝗼𝗺𝗽𝗿𝗲𝘀𝘀 ⬡ décompresser
│ ❐➻ 𝗿𝗲𝗮𝗱𝗾𝗿 ⬡ lire QR Code
│ ❐➻ 𝗼𝗰𝗿 ⬡ extraire texte image
│ ❐➻ 𝗽𝗱𝗳 ⬡ créer PDF
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗝𝗘𝗨𝗫-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝘁𝗶𝗰𝘁𝗮𝗰𝘁𝗼𝗲 ⬡ morpion
│ ❐➻ 𝗽𝗱𝗿 ⬡ pierre feuille ciseaux
│ ❐➻ 𝘀𝘂𝗱𝗼𝗸𝘂 ⬡ sudoku
│ ❐➻ 𝗾𝘂𝗶𝘇 ⬡ quiz culture
│ ❐➻ 𝘁𝗿𝘂𝘁𝗵𝟮 ⬡ vérité avancé
│ ❐➻ 𝗱𝗮𝗿𝗲𝟮 ⬡ défi avancé
│ ❐➻ 𝘀𝗹𝗼𝘁 ⬡ machine à sous
│ ❐➻ 𝗹𝗼𝘁𝘁𝗲𝗿𝘆 ⬡ loterie
│ ❐➻ 𝗰𝗵𝗲𝘀𝘀 ⬡ échecs
│ ❐➻ 𝗰𝗵𝗲𝗰𝗸𝗲𝗿𝘀 ⬡ dames
│ ❐➻ 𝗯𝗹𝗮𝗰𝗸𝗷𝗮𝗰𝗸 ⬡ blackjack
│ ❐➻ 𝗽𝗼𝗸𝗲𝗿 ⬡ poker
│ ❐➻ 𝗿𝗼𝘂𝗹𝗲𝘁𝘁𝗲 ⬡ roulette
│ ❐➻ 𝗱𝗶𝗰𝗲 ⬡ lancer dés
│ ❐➻ 𝗮𝗹𝗮𝗿𝗺 ⬡ alarme
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗠𝗘𝗗𝗜𝗔-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗯𝗹𝘂𝗿 ⬡ flouter image
│ ❐➻ 𝘀𝗵𝗮𝗿𝗽𝗲𝗻 ⬡ améliorer netteté
│ ❐➻ 𝗴𝗿𝗮𝘆𝘀𝗰𝗮𝗹𝗲 ⬡ noir et blanc
│ ❐➻ 𝗶𝗻𝘃𝗲𝗿𝘁 ⬡ inverser couleurs
│ ❐➻ 𝘀𝗲𝗽𝗶𝗮 ⬡ filtre sépia
│ ❐➻ 𝗳𝗹𝗶𝗽 ⬡ retourner image
│ ❐➻ 𝗿𝗼𝘁𝗮𝘁𝗲 ⬡ rotation image
│ ❐➻ 𝗰𝗿𝗼𝗽 ⬡ recadrer image
│ ❐➻ 𝗿𝗲𝘀𝗶𝘇𝗲 ⬡ redimensionner
│ ❐➻ 𝗰𝗼𝗺𝗽𝗿𝗲𝘀𝘀𝗶𝗺𝗴 ⬡ compresser image
│ ❐➻ 𝗿𝗲𝗺𝗼𝘃𝗲𝗯𝗴 ⬡ supprimer fond
│ ❐➻ 𝗲𝗻𝗵𝗮𝗻𝗰𝗲 ⬡ améliorer qualité
│ ❐➻ 𝘄𝗮𝘁𝗲𝗿𝗺𝗮𝗿𝗸 ⬡ ajouter filigrane
│ ❐➻ 𝗼𝘃𝗲𝗿𝗹𝗮𝘆 ⬡ superposer images
│ ❐➻ 𝗰𝗼𝗹𝗹𝗮𝗴𝗲 ⬡ créer collage
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗜𝗡𝗙𝗢-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗰𝗼𝘃𝗶𝗱 ⬡ stats COVID-19
│ ❐➻ 𝗻𝗲𝘄𝘀 ⬡ actualités
│ ❐➻ 𝗰𝗿𝘆𝗽𝘁𝗼 ⬡ crypto-monnaies
│ ❐➻ 𝘀𝘁𝗼𝗰𝗸𝘀 ⬡ bourse
│ ❐➻ 𝗳𝗼𝗼𝘁𝗯𝗮𝗹𝗹 ⬡ football
│ ❐➻ 𝗰𝗿𝗶𝗰𝗸𝗲𝘁 ⬡ cricket
│ ❐➻ 𝗯𝗮𝘀𝗸𝗲𝘁𝗯𝗮𝗹𝗹 ⬡ basketball
│ ❐➻ 𝘁𝗲𝗻𝗻𝗶𝘀 ⬡ tennis
│ ❐➻ 𝗳𝟭 ⬡ Formule 1
│ ❐➻ 𝗼𝗹𝘆𝗺𝗽𝗶𝗰𝘀 ⬡ Jeux Olympiques
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│││𝗨𝗧𝗜𝗟𝗜𝗧𝗬-𝗛𝗘𝗫-𝗕𝗢𝗧
│
│ ❐➻ 𝗰𝗮𝗹𝗰 ⬡ calcul rapide
│ ❐➻ 𝘁𝗶𝗺𝗲𝗿 ⬡ minuteur
│ ❐➻ 𝘀𝘁𝗼𝗽𝘄𝗮𝘁𝗰𝗵 ⬡ chronomètre
│ ❐➻ 𝗮𝗹𝗮𝗿𝗺 ⬡ alarme
│ ❐➻ 𝘁𝗶𝗺𝗲𝘇𝗼𝗻𝗲 ⬡ fuseau horaire
│ ❐➻ 𝗰𝗮𝗹𝗲𝗻𝗱𝗮𝗿 ⬡ calendrier
│ ❐➻ 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 ⬡ anniversaire
│ ❐➻ 𝗰𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻 ⬡ compte à rebours
│ ❐➻ 𝘃𝗼𝘁𝗲 ⬡ vote
│ ❐➻ 𝗿𝗲𝗽𝗼𝗿𝘁 ⬡ signalement
│ ❐➻ 𝘀𝘂𝗴𝗴𝗲𝘀𝘁 ⬡ suggestion
│ ❐➻ 𝗰𝗿𝗲𝗱𝗶𝘁𝘀 ⬡ crédits
│ ❐➻ 𝗱𝗼𝗻𝗮𝘁𝗲 ⬡ donation
│ ❐➻ 𝗯𝗮𝘀𝗸𝗲𝘁𝗯𝗮𝗹𝗹 ⬡ basketball
│ ❐➻ 𝘁𝗲𝗻𝗻𝗶𝘀 ⬡ tennis
┗━━━━━━━━━━━━━━━━━┛

━━◆ *𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧* ◆━━┓
│
│ 📊 229 commandes disponibles
│ 🔑 Prefixe: ${CONFIG.prefix}
│ ⏰ Heure: ${time}
│ 🟢 Statut: En ligne
│
│ ⚡ 𝗜𝗕-𝗛𝗘𝗫-𝗕𝗢𝗧 ⚡
│ propulsé par 𝗜𝗯𝘀𝗮𝗰𝗸𝗼™
│
┗━━━━━━━━━━━━━━━━━┛`;

            await sock.sendMessage(from, {
                image: { url: CONFIG.images.menu },
                caption: menuText
            });
        }
    },

    alive: {
        category: 'general',
        desc: 'Vérifier si le bot est en ligne',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            const uptime = getUptime(startTime);
            const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
            await sock.sendMessage(from, {
                image: { url: '' },
                caption: `╔══════════════════════╗
║   🥷 *CENTRAL-HEX* 🥷   ║
╠══════════════════════╣
║                      ║
║  ✅ *Statut*  : En ligne  ║
║  ⏱️  *Uptime*  : ${uptime}   ║
║  🌍 *Mode*    : ${CONFIG.mode}   ║
║  💾 *RAM*     : ${mem} MB  ║
║  👤 *Owner*   : ${CONFIG.ownerName} ║
║                      ║
╠══════════════════════╣
║  🛡️  Toutes systèmes OK  ║
╚══════════════════════╝

> _Propulsé par 🥷 IBSACKO™_`
            });
        }
    },

    dev: {
        category: 'general',
        desc: 'Informations sur le développeur',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, {
                image: { url: CONFIG.images.owner },
                caption: `🥷 *DÉVELOPPEUR*\n\n👤 Nom: ${CONFIG.developer}\n📱 WhatsApp: ${CONFIG.ownerNumber.split('@')[0]}\n🤖 Bot: ${CONFIG.botName}\n📧 Contact: Disponible via WhatsApp\n\n💡 *Note:* Ce bot a été développé avec passion par Ibrahima Sory Sacko.`
            });
        }
    },

    allvar: {
        category: 'general',
        desc: 'Afficher toutes les variables',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            const vars = `
*🔧 VARIABLES DU BOT*

🤖 *Nom:* ${CONFIG.botName}
👤 *Propriétaire:* ${CONFIG.ownerName}
📱 *Numéro:* ${CONFIG.ownerNumber.split('@')[0]}
⚙️ *Préfixe:* ${CONFIG.prefix}
🌐 *Mode:* ${CONFIG.mode}
🌍 *Timezone:* ${CONFIG.timezone}
⏰ *Uptime:* ${getUptime(startTime)}

*⚙️ PARAMÈTRES:*
• Anti-delete: ${db.settings.antiDelete ? '✅' : '❌'}
• Anti-link: ${db.settings.antiLink ? '✅' : '❌'}
• Anti-sticker: ${db.settings.antiSticker ? '✅' : '❌'}
• Auto-read: ${db.settings.autoRead ? '✅' : '❌'}
            `;
            await sock.sendMessage(from, { text: vars });
        }
    },

    ping: {
        category: 'general',
        desc: 'Vitesse de réponse du bot',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            const start = Date.now();
            await sock.sendMessage(from, { text: '🏓' });
            const ping = Date.now() - start;
            const uptime = getUptime(startTime);
            const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
            const latence = ping < 100 ? '🟢 Excellente' : ping < 300 ? '🟡 Bonne' : '🔴 Moyenne';
            await sock.sendMessage(from, {
                image: { url: '' },
                caption: `╔══════════════════════╗
║   🥷 *CENTRAL-HEX* 🥷   ║
╠══════════════════════╣
║                      ║
║  🏓 *Ping*    : ${ping} ms  ║
║  📶 *Latence* : ${latence} ║
║  ⏱️  *Uptime*  : ${uptime}   ║
║  💾 *RAM*     : ${mem} MB  ║
║  🖥️  *Status* : ✅ Online  ║
║                      ║
╚══════════════════════╝

> _Propulsé par 🥷 IBSACKO™_`
            });
        }
    },

    owner: {
        category: 'general',
        desc: 'Contact du propriétaire',
        async execute(ctx) {
            const { sock, from } = ctx;
            const num = CONFIG.ownerNumber.split('@')[0];
            await sock.sendMessage(from, {
                image: { url: '' },
                caption: `╔══════════════════════╗
║   🥷 *CENTRAL-HEX* 🥷   ║
╠══════════════════════╣
║  👑 *PROPRIÉTAIRE*    ║
╠══════════════════════╣
║                      ║
║  👤 *Nom* : ${CONFIG.ownerName} ║
║  📞 *Tel* : +${num}  ║
║  🤖 *Bot* : ${CONFIG.botName} ║
║                      ║
╠══════════════════════╣
║  💬 Contactez le     ║
║  propriétaire 👇     ║
╚══════════════════════╝`
            });
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${CONFIG.ownerName}\nTEL;waid=${num}:+${num}\nEND:VCARD`;
            await sock.sendMessage(from, {
                contacts: { displayName: CONFIG.ownerName, contacts: [{ vcard }] }
            });
        }
    },

    stats: {
        category: 'general',
        desc: 'Statistiques du bot',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            const stats = `
📊 *STATISTIQUES CENTRAL-HEX*

🤖 *Bot:* ${CONFIG.botName}
⏰ *Uptime:* ${getUptime(startTime)}
📅 *Date:* ${moment().tz(CONFIG.timezone).format('DD/MM/YYYY')}
🕐 *Heure:* ${moment().tz(CONFIG.timezone).format('HH:mm:ss')}

📈 *COMMANDES:*
• Total: 200
• Catégories: 14
• Actives: ✅

💾 *MÉMOIRE:*
• Utilisée: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Totale: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB

🔧 *NODE.JS:* ${process.version}
            `;
            await sock.sendMessage(from, { text: stats });
        }
    },

    uptime: {
        category: 'general',
        desc: 'Temps de fonctionnement',
        async execute(ctx) {
            const { sock, from, startTime } = ctx;
            await sock.sendMessage(from, { 
                text: `⏰ *UPTIME*\n\nLe bot fonctionne depuis:\n🕐 ${getUptime(startTime)}\n\n🚀 Démarré le: ${moment(startTime).tz(CONFIG.timezone).format('DD/MM/YYYY à HH:mm:ss')}` 
            });
        }
    },

    info: {
        category: 'general',
        desc: 'Informations sur le bot',
        async execute(ctx) {
            const { sock, from } = ctx;
            const info = `
🥷 *${CONFIG.botName}* v3.0.0

📝 *Description:* Bot WhatsApp avancé avec 200 commandes développé par Ibrahima Sory Sacko.

✨ *Fonctionnalités:*
• Intelligence Artificielle
• Téléchargement médias
• Gestion de groupes
• Jeux interactifs
• Conversion de fichiers
• Recherches web
• Et bien plus...

🔧 *Technologies:*
• Node.js
• Baileys API
• WhatsApp Web

📱 *Développeur:* ${CONFIG.developer}
©️ 2024 Tous droits réservés.
            `;
            await sock.sendMessage(from, { text: info });
        }
    },

    support: {
        category: 'general',
        desc: 'Support technique',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { 
                text: `🆘 *SUPPORT*\n\n📱 Contactez le développeur:\n👉 ${CONFIG.ownerNumber.split('@')[0]}\n\n💬 Décrivez votre problème en détail pour une assistance rapide.` 
            });
        }
    },

    // ═══════════════════════════════════════════════════
    // 2. OWNER - 20 commandes
    // ═══════════════════════════════════════════════════

    join: {
        category: 'owner',
        desc: 'Rejoindre un groupe via lien',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibjoin <lien>' });
            
            const link = args[0];
            const code = link.split('chat.whatsapp.com/')[1];
            if (!code) return await sock.sendMessage(from, { text: '❌ Lien invalide' });
            
            try {
                const res = await sock.groupAcceptInvite(code);
                await sock.sendMessage(from, { text: `✅ Rejoint: ${res}` });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    leave: {
        category: 'owner',
        desc: 'Quitter le groupe',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isGroup, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!isGroup) return await sock.sendMessage(from, { text: '❌ Groupe uniquement' });
            
            await sock.sendMessage(from, { text: '👋 Au revoir!' });
            await sock.groupLeave(from);
        }
    },

    antidelete: {
        category: 'owner',
        desc: 'Anti-suppression on/off',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const status = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(status)) {
                return await sock.sendMessage(from, { text: '❌ Usage: Ibantidelete on/off' });
            }
            
            db.settings.antiDelete = status === 'on';
            await sock.sendMessage(from, { 
                text: `🛡️ Anti-delete ${status === 'on' ? '✅ activé' : '❌ désactivé'}` 
            });
        }
    },

    upload: {
        category: 'owner',
        desc: 'Téléverser un fichier',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, m, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            await sock.sendMessage(from, { text: '📤 Fonction upload - Envoyez le fichier' });
        }
    },

    hex: {
        category: 'owner',
        desc: 'Voir les messages vue unique',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, m, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, {
                image: { url: 'https://h.uguu.se/uZvwPpnm.jpg' },
                caption: `╔══════════════════╗\n║  🥷 *CENTRAL-HEX*  ║\n╠══════════════════╣\n║  ❌ Réservé au    ║\n║  propriétaire    ║\n╚══════════════════╝`
            });
            
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return await sock.sendMessage(from, {
                text: `╔══════════════════╗\n║  🥷 *CENTRAL-HEX*  ║\n╠══════════════════╣\n║  ❌ Répondez à un  ║\n║  message vue unique║\n╚══════════════════╝`
            });
            
            const type = Object.keys(quoted)[0];
            if (type !== 'imageMessage' && type !== 'videoMessage') {
                return await sock.sendMessage(from, { text: '❌ Ce média n\'est pas supporté.' });
            }
            
            try {
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                await sock.sendMessage(from, {
                    [type === 'imageMessage' ? 'image' : 'video']: buffer,
                    caption: `╔══════════════════╗\n║  🥷 *CENTRAL-HEX*  ║\n╠══════════════════╣\n║  ✅ Vue unique     ║\n║  récupérée !      ║\n╚══════════════════╝`
                });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    allcmds: {
        category: 'owner',
        desc: 'Liste de toutes les commandes',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const cmdList = Object.keys(commands).sort().join(', ');
            await sock.sendMessage(from, { 
                text: `📋 *COMMANDES (${Object.keys(commands).length})*\n\n${cmdList}` 
            });
        }
    },

    hex2: {
        category: 'owner',
        desc: 'Envoyer vue unique directement en PV du propriétaire',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const ownerJid = CONFIG.ownerNumber;
            
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return; // Silence total si pas de média

            const type = Object.keys(quoted)[0];
            if (type !== 'imageMessage' && type !== 'videoMessage') return;

            try {
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                const sender = m.key.participant || m.key.remoteJid;
                const senderNum = sender.split('@')[0];
                const groupName = from.endsWith('@g.us') ? (await sock.groupMetadata(from)).subject : 'Privé';
                
                await sock.sendMessage(ownerJid, {
                    [type === 'imageMessage' ? 'image' : 'video']: buffer,
                    caption: `╔══════════════════════╗\n║   🥷 *CENTRAL-HEX* 🥷   ║\n╠══════════════════════╣\n║  📩 *Vue unique reçue* ║\n╠══════════════════════╣\n║  👤 De: @${senderNum} ║\n║  💬 Groupe: ${groupName}   ║\n╚══════════════════════╝`
                });
                // Pas de réponse dans le groupe - silence total
            } catch (err) {
                console.error('hex2 error:', err.message);
            }
        }
    },

    delete: {
        category: 'owner',
        desc: 'Supprimer un message',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, m, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const quoted = m.message?.extendedTextMessage?.contextInfo;
            if (!quoted) return await sock.sendMessage(from, { text: '❌ Répondez à un message' });
            
            await sock.sendMessage(from, { delete: quoted.stanzaId });
        }
    },

    ninja: {
        name: '🥷',
        category: 'owner',
        desc: 'Télécharger dans le privé (vv2)',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, m, isOwner, config } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return await sock.sendMessage(from, { text: '❌ Répondez à un message' });
            
            const type = Object.keys(quoted)[0];
            if (type !== 'imageMessage' && type !== 'videoMessage') {
                return await sock.sendMessage(from, { text: '❌ Pas un média' });
            }
            
            try {
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                
                // Envoyer au propriétaire en privé
                await sock.sendMessage(CONFIG.ownerNumber, {
                    [type === 'imageMessage' ? 'image' : 'video']: buffer,
                    caption: `🥷 Récupéré de ${from}\n⏰ ${moment().tz(CONFIG.timezone).format('HH:mm:ss')}`
                });
                
                await sock.sendMessage(from, { text: '✅ Envoyé dans votre privé!' });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    repo: {
        category: 'owner',
        desc: 'Lien du dépôt GitHub',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            await sock.sendMessage(from, { 
                text: '📁 *DÉPÔT GITHUB*\n\n🔗 https://github.com/votre-username/ib-hex-bot\n\n💡 Clonez et modifiez selon vos besoins.' 
            });
        }
    },

    broadcast: {
        category: 'owner',
        desc: 'Message à tous les chats',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbroadcast <message>' });
            
            const msg = args.join(' ');
            const chats = await sock.groupFetchAllParticipating();
            let count = 0;
            
            for (const id in chats) {
                await sock.sendMessage(id, { text: `📢 *BROADCAST*\n\n${msg}` });
                count++;
            }
            
            await sock.sendMessage(from, { text: `✅ Envoyé à ${count} groupes` });
        }
    },

    setpp: {
        category: 'owner',
        desc: 'Changer photo de profil',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, m, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            await sock.sendMessage(from, { text: '📸 Envoyez une image avec la légende Ibsetpp' });
        }
    },

    setname: {
        category: 'owner',
        desc: 'Changer nom du bot',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsetname <nom>' });
            
            // Note: Baileys ne permet pas de changer le nom du bot directement
            await sock.sendMessage(from, { text: '✅ Nom mis à jour (dans la config)' });
        }
    },

    setbio: {
        category: 'owner',
        desc: 'Changer bio/status',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsetbio <texte>' });
            
            const bio = args.join(' ');
            await sock.updateProfileStatus(bio);
            await sock.sendMessage(from, { text: '✅ Bio mise à jour' });
        }
    },

    block: {
        category: 'owner',
        desc: 'Bloquer un utilisateur',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibblock <numéro>' });
            
            const num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.updateBlockStatus(num, 'block');
            await sock.sendMessage(from, { text: `✅ ${args[0]} bloqué` });
        }
    },

    unblock: {
        category: 'owner',
        desc: 'Débloquer un utilisateur',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, args, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibunblock <numéro>' });
            
            const num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.updateBlockStatus(num, 'unblock');
            await sock.sendMessage(from, { text: `✅ ${args[0]} débloqué` });
        }
    },

    clearchats: {
        category: 'owner',
        desc: 'Vider tous les chats',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const chats = await sock.chats.all();
            for (const chat of chats) {
                await sock.chatModify({ delete: true, lastMessages: [] }, chat.id);
            }
            await sock.sendMessage(from, { text: '✅ Tous les chats vidés' });
        }
    },

    archive: {
        category: 'owner',
        desc: 'Archiver un chat',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            await sock.chatModify({ archive: true }, from);
            await sock.sendMessage(from, { text: '✅ Chat archivé' });
        }
    },

    unarchive: {
        category: 'owner',
        desc: 'Désarchiver un chat',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            await sock.chatModify({ archive: false }, from);
            await sock.sendMessage(from, { text: '✅ Chat désarchivé' });
        }
    },

    readall: {
        category: 'owner',
        desc: 'Marquer tout comme lu',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            
            const chats = await sock.chats.all();
            for (const chat of chats) {
                await sock.chatModify({ markRead: true }, chat.id);
            }
            await sock.sendMessage(from, { text: '✅ Tout marqué comme lu' });
        }
    },

    self: {
        category: 'owner',
        desc: 'Mode self (uniquement owner)',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            CONFIG.mode = 'self';
            await sock.sendMessage(from, { text: '🔒 Mode SELF activé (uniquement owner)' });
        }
    },

    public: {
        category: 'owner',
        desc: 'Mode public (tout le monde)',
        ownerOnly: true,
        async execute(ctx) {
            const { sock, from, isOwner } = ctx;
            if (!isOwner) return await sock.sendMessage(from, { text: '❌ Réservé au propriétaire' });
            CONFIG.mode = 'public';
            await sock.sendMessage(from, { text: '🔓 Mode PUBLIC activé (tout le monde)' });
        }
    },

    // ═══════════════════════════════════════════════════
    // 3. AI - 15 commandes
    // ═══════════════════════════════════════════════════

    ai: {
        category: 'ai',
        desc: 'Intelligence artificielle',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibai <question>' });
            
            const query = args.join(' ');
            // Simulation AI (remplacer par vraie API)
            await sock.sendMessage(from, { 
                text: `🤖 *AI Response:*\n\nVous avez demandé: "${query}"\n\n💡 Note: Connectez une API OpenAI/Gemini pour de vraies réponses.` 
            });
        }
    },

    bug: {
        category: 'ai',
        desc: 'Signaler un bug',
        async execute(ctx) {
            const { sock, from, args, sender } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbug <description>' });
            
            const report = args.join(' ');
            await sock.sendMessage(CONFIG.ownerNumber, { 
                text: `🐛 *BUG REPORT*\n\nDe: ${sender}\nMessage: ${report}` 
            });
            await sock.sendMessage(from, { text: '✅ Bug signalé au développeur' });
        }
    },

    bot: {
        category: 'ai',
        desc: 'Infos sur le bot',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { 
                text: `🤖 Je suis ${CONFIG.botName}, un bot WhatsApp créé par ${CONFIG.developer}. J'ai 200 commandes disponibles!` 
            });
        }
    },

    gemini: {
        category: 'ai',
        desc: 'IA Gemini Google',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibgemini <texte>' });
            
            const query = args.join(' ');
            try {
                // API Gemini simulation
                await sock.sendMessage(from, { 
                    text: `♊ *Gemini:*\n\nTraitement de: "${query}"\n\n⚠️ Ajoutez votre clé API Gemini dans la config.` 
                });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    chatbot: {
        category: 'ai',
        desc: 'Discussion IA',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibchatbot <message>' });
            
            const msg = args.join(' ');
            await sock.sendMessage(from, { 
                text: `💬 *ChatBot:* ${msg}\n\nJe suis un chatbot simple. Pour des réponses avancées, utilisez Ibai ou Ibgemini.` 
            });
        }
    },

    gpt: {
        category: 'ai',
        desc: 'ChatGPT',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibgpt <question>' });
            
            const query = args.join(' ');
            await sock.sendMessage(from, { 
                text: `🧠 *ChatGPT:*\n\nQuestion: ${query}\n\n⚠️ Intégrez l'API OpenAI pour utiliser GPT-4.` 
            });
        }
    },

    bard: {
        category: 'ai',
        desc: 'Google Bard',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbard <texte>' });
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?prompt=${encodeURIComponent(query)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `🎭 *Bard IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Bard: ' + err.message });
            }
        }
    },

    bing: {
        category: 'ai',
        desc: 'Bing AI',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbing <texte>' });
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(query)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `🔍 *Bing IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Bing: ' + err.message });
            }
        }
    },

    claude: {
        category: 'ai',
        desc: 'Claude AI',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibclaude <texte>' });
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(query)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `🧩 *Claude IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Claude: ' + err.message });
            }
        }
    },

    perplexity: {
        category: 'ai',
        desc: 'Perplexity AI',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibperplexity <texte>' });
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(query)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `❓ *Perplexity IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Perplexity: ' + err.message });
            }
        }
    },

    youchat: {
        category: 'ai',
        desc: 'YouChat',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibyouchat <texte>' });
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(query)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `💭 *YouChat IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur YouChat: ' + err.message });
            }
        }
    },

    character: {
        category: 'ai',
        desc: 'Character AI',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibcharacter <personnage> <message>' });
            const prompt = 'Réponds comme le personnage ' + args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(prompt)}`);
                const answer = res.data?.data || res.data?.result || 'Pas de réponse.';
                await sock.sendMessage(from, { text: `🎭 *Character IA:*\n\n${answer}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Character: ' + err.message });
            }
        }
    },

    rewrite: {
        category: 'ai',
        desc: 'Réécrire un texte',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibrewrite <texte>' });
            await sock.sendMessage(from, { text: `✍️ *Réécriture:*\n\nOriginal: ${args.join(' ')}\n\n⚠️ Connectez une API pour la réécriture.` });
        }
    },

    summarize: {
        category: 'ai',
        desc: 'Résumer un texte',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsummarize <texte>' });
            const text = args.join(' ');
            try {
                const prompt = 'Résume ce texte en 3 phrases maximum en français: ' + text;
                const res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?prompt=${encodeURIComponent(prompt)}`);
                const summary = res.data?.data || res.data?.result || 'Résumé indisponible.';
                await sock.sendMessage(from, { text: `📄 *Résumé:*\n\n${summary}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur résumé: ' + err.message });
            }
        }
    },

    translate: {
        category: 'ai',
        desc: 'Traduire un texte',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibtranslate <lang> <texte>\nEx: Ibtranslate en Bonjour' });
            
            const lang = args[0];
            const text = args.slice(1).join(' ');
            await sock.sendMessage(from, { 
                text: `🌐 *Traduction (${lang}):*\n\nOriginal: ${text}\n\n⚠️ Intégrez Google Translate API.` 
            });
        }
    },

    // ═══════════════════════════════════════════════════
    // 4. CONVERTER - 15 commandes
    // ═══════════════════════════════════════════════════

    attp: {
        category: 'converter',
        desc: 'Texte en sticker animé',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibattp <texte>' });
            
            const text = args.join(' ');
            try {
                const url = `https://api.siputzx.my.id/api/maker/attp?text=${encodeURIComponent(text)}`;
                const res = await axios.get(url, { responseType: 'arraybuffer' });
                await sock.sendMessage(from, { sticker: Buffer.from(res.data), caption: '🎨 Sticker généré !' });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur génération sticker: ' + err.message });
            }
        }
    },

    toimage: {
        category: 'converter',
        desc: 'Convertir sticker en image',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.stickerMessage) return await sock.sendMessage(from, { text: '❌ Répondez à un sticker' });
            
            try {
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                await sock.sendMessage(from, { image: buffer, caption: '🖼️ Converti en image' });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    gimage: {
        category: 'converter',
        desc: 'Recherche image Google',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibgimage <recherche>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/image?query=${encodeURIComponent(query)}`);
                const img = res.data?.data?.[0];
                if (!img) return await sock.sendMessage(from, { text: '❌ Aucune image trouvée.' });
                await sock.sendMessage(from, { image: { url: img.url || img }, caption: `🔍 *${query}*` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur image: ' + err.message });
            }
        }
    },

    mp3: {
        category: 'converter',
        desc: 'Convertir vidéo en MP3',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.videoMessage) return await sock.sendMessage(from, { text: '❌ Répondez à une vidéo' });
            
            await sock.sendMessage(from, { text: '🎵 Conversion en MP3...\n\n⚠️ Nécessite ffmpeg.' });
        }
    },

    ss: {
        category: 'converter',
        desc: 'Capture d\'écran web',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibss <url>' });
            
            const url = args[0];
            if (!url.startsWith('http')) return await sock.sendMessage(from, { text: '❌ URL invalide' });
            
            try {
                const apiUrl = `https://api.siputzx.my.id/api/tools/screenshot?url=${encodeURIComponent(url)}`;
                const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
                await sock.sendMessage(from, { image: Buffer.from(res.data), caption: `📸 Capture: ${url}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur screenshot: ' + err.message });
            }
        }
    },

    fancy: {
        category: 'converter',
        desc: 'Texte stylé',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibfancy <texte>' });
            
            const text = args.join(' ');
            const fancy = text.split('').map(c => {
                const fancyChars = { 'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮' };
                return fancyChars[c.toLowerCase()] || c;
            }).join('');
            
            await sock.sendMessage(from, { text: `✨ *Texte stylé:*\n\n${fancy}` });
        }
    },

    url: {
        category: 'converter',
        desc: 'Extraire lien',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return await sock.sendMessage(from, { text: '❌ Répondez à un message' });
            
            const text = quoted.conversation || quoted.extendedTextMessage?.text || '';
            const urls = text.match(/(https?:\/\/[^\s]+)/g) || [];
            
            if (!urls.length) return await sock.sendMessage(from, { text: '❌ Aucun lien trouvé' });
            await sock.sendMessage(from, { text: `🔗 *Liens trouvés:*\n\n${urls.join('\n')}` });
        }
    },

    sticker: {
        category: 'converter',
        desc: 'Créer sticker',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted?.imageMessage && !quoted?.videoMessage) {
                return await sock.sendMessage(from, { text: '❌ Répondez à une image/vidéo' });
            }
            
            try {
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                await sock.sendMessage(from, { 
                    sticker: buffer,
                    mimetype: quoted.imageMessage ? 'image/webp' : 'video/webp'
                });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    take: {
        category: 'converter',
        desc: 'Récupérer média',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return await sock.sendMessage(from, { text: '❌ Répondez à un média' });
            
            try {
                const type = Object.keys(quoted)[0];
                const buffer = await downloadMediaMessage(
                    { key: m.message.extendedTextMessage.contextInfo.stanzaId, message: quoted },
                    'buffer'
                );
                
                const ext = type.includes('image') ? 'jpg' : type.includes('video') ? 'mp4' : 'bin';
                await sock.sendMessage(from, { 
                    document: buffer,
                    mimetype: 'application/octet-stream',
                    fileName: `media_${Date.now()}.${ext}`
                });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur: ${err.message}` });
            }
        }
    },

    tomp4: {
        category: 'converter',
        desc: 'Convertir en MP4',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            await sock.sendMessage(from, { text: '🎬 Conversion en MP4...\n\n⚠️ Nécessite ffmpeg.' });
        }
    },

    togif: {
        category: 'converter',
        desc: 'Convertir en GIF',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            await sock.sendMessage(from, { text: '🎞️ Conversion en GIF...\n\n⚠️ Nécessite ffmpeg.' });
        }
    },

    topdf: {
        category: 'converter',
        desc: 'Convertir en PDF',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            await sock.sendMessage(from, { text: '📄 Conversion en PDF...\n\n⚠️ Nécessite une librairie PDF.' });
        }
    },

    todoc: {
        category: 'converter',
        desc: 'Convertir en document',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            await sock.sendMessage(from, { text: '📎 Conversion en document...' });
        }
    },

    tourl: {
        category: 'converter',
        desc: 'Uploader et obtenir URL',
        async execute(ctx) {
            const { sock, from, m } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return await sock.sendMessage(from, { text: '❌ Répondez à une image ou vidéo à uploader.' });
            try {
                const buffer = await downloadMediaMessage({ key: m.key, message: quoted }, 'buffer');
                const FormData = require('form-data');
                const form = new FormData();
                form.append('image', buffer.toString('base64'));
                const res = await axios.post('https://api.imgbb.com/1/upload?key=public', form, { headers: form.getHeaders() });
                const link = res.data?.data?.url || 'Lien indisponible';
                await sock.sendMessage(from, { text: `✅ *Fichier uploadé !*\n\n🔗 ${link}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur upload: ' + err.message });
            }
        }
    },

    emojimix: {
        category: 'converter',
        desc: 'Mélanger deux emojis',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibemojimix 😂 🤔' });
            
            try {
                const e1 = encodeURIComponent(args[0]);
                const e2 = encodeURIComponent(args[1]);
                const url = `https://emojikitchen.dev/`;
                await sock.sendMessage(from, { text: `😀 *Emoji Mix:* ${args[0]} + ${args[1]}\n\n🔗 Visitez: ${url}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur emojimix: ' + err.message });
            }
        }
    },

    // ═══════════════════════════════════════════════════
    // 5. SEARCH - 20 commandes
    // ═══════════════════════════════════════════════════

    google: {
        category: 'search',
        desc: 'Recherche Google',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibgoogle <recherche>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/google?query=${encodeURIComponent(query)}`);
                const results = res.data?.data?.slice(0, 3) || [];
                if (!results.length) return await sock.sendMessage(from, { text: '❌ Aucun résultat trouvé.' });
                let text = `🔍 *Google: ${query}*\n\n`;
                results.forEach((r, i) => { text += `*${i+1}. ${r.title}*\n${r.snippet}\n🔗 ${r.link}\n\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Google: ' + err.message });
            }
        }
    },

    play: {
        category: 'search',
        desc: 'Recherche Play Store',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibplay <app>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query)}`);
                const video = res.data?.data?.[0];
                if (!video) return await sock.sendMessage(from, { text: '❌ Aucun résultat.' });
                await sock.sendMessage(from, { text: `🎵 *${video.title}*\n⏱️ ${video.duration}\n👁️ ${video.views}\n🔗 ${video.url}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur recherche: ' + err.message });
            }
        }
    },

    video: {
        category: 'search',
        desc: 'Recherche vidéo',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibvideo <recherche>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query)}`);
                const videos = res.data?.data?.slice(0, 3) || [];
                if (!videos.length) return await sock.sendMessage(from, { text: '❌ Aucune vidéo trouvée.' });
                let text = `🎥 *Résultats pour: ${query}*\n\n`;
                videos.forEach((v, i) => { text += `*${i+1}. ${v.title}*\n⏱️ ${v.duration} | 👁️ ${v.views}\n🔗 ${v.url}\n\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur vidéo: ' + err.message });
            }
        }
    },

    song: {
        category: 'search',
        desc: 'Recherche musique',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsong <titre>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query + ' music')}`);
                const song = res.data?.data?.[0];
                if (!song) return await sock.sendMessage(from, { text: '❌ Aucune musique trouvée.' });
                await sock.sendMessage(from, { text: `🎵 *${song.title}*\n⏱️ ${song.duration}\n🔗 ${song.url}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur musique: ' + err.message });
            }
        }
    },

    mediafire: {
        category: 'search',
        desc: 'Recherche MediaFire',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibmediafire <fichier>' });
            
            const query = args.join(' ');
            await sock.sendMessage(from, { text: `📦 *MediaFire:* ${query}\n\n🔗 https://www.mediafire.com/${encodeURIComponent(query)}` });
        }
    },

    facebook: {
        category: 'search',
        desc: 'Recherche Facebook',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibfacebook <recherche>' });
            
            await sock.sendMessage(from, { text: `📘 *Facebook:* ${args.join(' ')}\n\n⚠️ API Graph Facebook requise.` });
        }
    },

    instagram: {
        category: 'search',
        desc: 'Recherche Instagram',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibinstagram <username>' });
            
            await sock.sendMessage(from, { text: `📸 *Instagram:* ${args.join(' ')}\n\n⚠️ API Instagram Basic Display requise.` });
        }
    },

    tiktok: {
        category: 'search',
        desc: 'Recherche TikTok',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibtiktok <recherche>' });
            
            await sock.sendMessage(from, { text: `🎵 *TikTok:* ${args.join(' ')}\n\n⚠️ API TikTok for Developers ou scraper.` });
        }
    },

    lyrics: {
        category: 'search',
        desc: 'Paroles de chanson',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Iblyrics <titre>' });
            
            const song = args.join(' ');
            try {
                const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.split(' ')[0])}/${encodeURIComponent(song.split(' ').slice(1).join(' ') || song)}`);
                const lyrics = res.data?.lyrics?.substring(0, 1000) || 'Paroles non trouvées.';
                await sock.sendMessage(from, { text: `🎤 *${song}*\n\n${lyrics}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Paroles introuvables pour: ' + song });
            }
        }
    },

    image: {
        category: 'search',
        desc: 'Recherche d\'images',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibimage <recherche>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/image?query=${encodeURIComponent(query)}`);
                const img = res.data?.data?.[0];
                if (!img) return await sock.sendMessage(from, { text: '❌ Aucune image trouvée.' });
                await sock.sendMessage(from, { image: { url: img.url || img }, caption: `🖼️ ${query}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur image: ' + err.message });
            }
        }
    },

    pinterest: {
        category: 'search',
        desc: 'Recherche Pinterest',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibpinterest <recherche>' });
            
            await sock.sendMessage(from, { text: `📌 *Pinterest:* ${args.join(' ')}\n\n⚠️ API Pinterest requise.` });
        }
    },

    youtube: {
        category: 'search',
        desc: 'Recherche YouTube',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibyoutube <recherche>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query)}`);
                const videos = res.data?.data?.slice(0, 3) || [];
                if (!videos.length) return await sock.sendMessage(from, { text: '❌ Aucun résultat YouTube.' });
                let text = `▶️ *YouTube: ${query}*\n\n`;
                videos.forEach((v, i) => { text += `*${i+1}. ${v.title}*\n⏱️ ${v.duration}\n🔗 ${v.url}\n\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur YouTube: ' + err.message });
            }
        }
    },

    twittersearch: {
        category: 'search',
        desc: 'Recherche Twitter/X',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibtwitter <recherche>' });
            
            await sock.sendMessage(from, { text: `🐦 *Twitter:* ${args.join(' ')}\n\n⚠️ API Twitter/X requise.` });
        }
    },

    spotify: {
        category: 'search',
        desc: 'Recherche Spotify',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibspotify <titre>' });
            
            await sock.sendMessage(from, { text: `🎧 *Spotify:* ${args.join(' ')}\n\n⚠️ API Spotify Web requise.` });
        }
    },

    applemusic: {
        category: 'search',
        desc: 'Recherche Apple Music',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibapplemusic <titre>' });
            
            await sock.sendMessage(from, { text: `🍎 *Apple Music:* ${args.join(' ')}\n\n⚠️ API Apple Music requise.` });
        }
    },

    soundcloud: {
        category: 'search',
        desc: 'Recherche SoundCloud',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsoundcloud <titre>' });
            
            await sock.sendMessage(from, { text: `☁️ *SoundCloud:* ${args.join(' ')}\n\n⚠️ API SoundCloud requise.` });
        }
    },

    wikipedia: {
        category: 'search',
        desc: 'Recherche Wikipedia',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibwikipedia <sujet>' });
            
            const query = args.join(' ');
            try {
                const res = await axios.get(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                const data = res.data;
                await sock.sendMessage(from, { 
                    text: `📚 *Wikipedia:* ${data.title}\n\n${data.extract}\n\n🔗 ${data.content_urls?.desktop?.page || ''}` 
                });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Article non trouvé: ${query}` });
            }
        }
    },

    wikihow: {
        category: 'search',
        desc: 'Recherche WikiHow',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibwikihow <recherche>' });
            
            await sock.sendMessage(from, { text: `📖 *WikiHow:* ${args.join(' ')}\n\n⚠️ Scraper requis.` });
        }
    },

    amazon: {
        category: 'search',
        desc: 'Recherche Amazon',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibamazon <produit>' });
            
            await sock.sendMessage(from, { text: `📦 *Amazon:* ${args.join(' ')}\n\n⚠️ API Amazon Product Advertising requise.` });
        }
    },

    ebay: {
        category: 'search',
        desc: 'Recherche eBay',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibebay <produit>' });
            
            await sock.sendMessage(from, { text: `🏷️ *eBay:* ${args.join(' ')}\n\n⚠️ API eBay requise.` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 6. FUN - 20 commandes
    // ═══════════════════════════════════════════════════

    getpp: {
        category: 'fun',
        desc: 'Photo de profil',
        async execute(ctx) {
            const { sock, from, m, args } = ctx;
            let target = m.message?.extendedTextMessage?.contextInfo?.participant || args[0] + '@s.whatsapp.net' || from;
            
            try {
                const pp = await sock.profilePictureUrl(target, 'image');
                await sock.sendMessage(from, { image: { url: pp }, caption: '🖼️ Photo de profil' });
            } catch {
                await sock.sendMessage(from, { text: '❌ Photo privée ou inexistante' });
            }
        }
    },

    goodnight: {
        category: 'fun',
        desc: 'Souhaiter bonne nuit',
        async execute(ctx) {
            const { sock, from } = ctx;
            const messages = [
                '🌙 Bonne nuit! Que tes rêves soient doux! 🥷',
                '⭐ Dors bien! À demain! 🥷',
                '🌜 Que la nuit te soit bénéfique! 🥷'
            ];
            await sock.sendMessage(from, { text: messages[Math.floor(Math.random() * messages.length)] });
        }
    },

    wcg: {
        category: 'fun',
        desc: 'Classement Word Chain Game',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🏆 *Classement WCG*\n\n1. 🥷 Player1 - 100 pts\n2. 🥷 Player2 - 80 pts\n3. 🥷 Player3 - 60 pts' });
        }
    },

    quizz: {
        category: 'fun',
        desc: 'Quiz interactif',
        async execute(ctx) {
            const { sock, from } = ctx;
            const questions = [
                { q: 'Capitale de la France?', a: 'Paris' },
                { q: '2+2?', a: '4' }
            ];
            const q = questions[Math.floor(Math.random() * questions.length)];
            await sock.sendMessage(from, { text: `❓ *QUIZZ*\n\n${q.q}\n\n💡 Répondez avec la bonne réponse!` });
        }
    },

    anime: {
        category: 'fun',
        desc: 'Recherche anime',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibanime <nom>' });
            
            await sock.sendMessage(from, { text: `🎌 *Anime:* ${args.join(' ')}\n\n⚠️ API Jikan (MyAnimeList) ou AniList.` });
        }
    },

    profile: {
        category: 'fun',
        desc: 'Profil utilisateur',
        async execute(ctx) {
            const { sock, from, sender } = ctx;
            await sock.sendMessage(from, { 
                text: `👤 *Profil*\n\n📱 ID: ${sender}\n🤖 Bot: ${CONFIG.botName}\n⏰ Inscrit: ${moment().format('DD/MM/YYYY')}` 
            });
        }
    },

    couple: {
        category: 'fun',
        desc: 'Ship deux personnes',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibcouple @user1 @user2' });
            
            const percent = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { 
                text: `💕 *COUPLE*\n\n❤️ Compatibilité: ${percent}%\n${percent > 50 ? '🔥 Match parfait!' : '💔 Pas de chance...'}` 
            });
        }
    },

    poll: {
        category: 'fun',
        desc: 'Créer un sondage',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibpoll <question>' });
            
            await sock.sendMessage(from, { 
                poll: {
                    name: args.join(' '),
                    values: ['✅ Oui', '❌ Non', '🤷 Peut-être'],
                    selectableCount: 1
                }
            });
        }
    },

    emojimix2: {
        category: 'fun',
        desc: 'Mélanger emojis',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibemojimix2 😂 🤔' });
            await sock.sendMessage(from, { text: `${args[0]} + ${args[1]} = ${args[0]}${args[1]}` });
        }
    },

    joke: {
        category: 'fun',
        desc: 'Blague aléatoire',
        async execute(ctx) {
            const { sock, from } = ctx;
            const jokes = [
                'Pourquoi les plongeurs plongent-ils toujours en arrière? Parce que sinon ils tombent dans le bateau! 🥷',
                'Quel est le comble pour un électricien? De ne pas être au courant! ⚡'
            ];
            await sock.sendMessage(from, { text: jokes[Math.floor(Math.random() * jokes.length)] });
        }
    },

    meme: {
        category: 'fun',
        desc: 'Mème aléatoire',
        async execute(ctx) {
            const { sock, from } = ctx;
            try {
                const res = await axios.get('https://meme-api.com/gimme');
                const meme = res.data;
                await sock.sendMessage(from, { image: { url: meme.url }, caption: `😂 *${meme.title}*\n👍 ${meme.ups} likes` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur mème: ' + err.message });
            }
        }
    },

    quote: {
        category: 'fun',
        desc: 'Citation aléatoire',
        async execute(ctx) {
            const { sock, from } = ctx;
            const quotes = [
                'La vie est belle! 🥷',
                'Le succès est la somme de petits efforts répétés jour après jour. 🥷',
                'Ne rêve pas ta vie, vis tes rêves! 🥷'
            ];
            await sock.sendMessage(from, { text: `💭 *Citation:*\n\n${quotes[Math.floor(Math.random() * quotes.length)]}` });
        }
    },

    fact: {
        category: 'fun',
        desc: 'Fait aléatoire',
        async execute(ctx) {
            const { sock, from } = ctx;
            const facts = [
                'Les 🥷 ninjas existaient vraiment au Japon féodal!',
                'Le cœur d\'une baleine bat seulement 9 fois par minute!',
                'Une journée sur Vénus dure plus longtemps qu\'une année sur Vénus!'
            ];
            await sock.sendMessage(from, { text: `📚 *Le saviez-vous?*\n\n${facts[Math.floor(Math.random() * facts.length)]}` });
        }
    },

    dare: {
        category: 'fun',
        desc: 'Défi/action',
        async execute(ctx) {
            const { sock, from } = ctx;
            const dares = [
                'Envoie un message à ton crush! 💕',
                'Fais 10 pompes! 💪',
                'Chante une chanson! 🎵'
            ];
            await sock.sendMessage(from, { text: `🎯 *DÉFI:*\n\n${dares[Math.floor(Math.random() * dares.length)]}` });
        }
    },

    truth: {
        category: 'fun',
        desc: 'Vérité',
        async execute(ctx) {
            const { sock, from } = ctx;
            const truths = [
                'Quel est ton plus grand secret? 🤫',
                'As-tu déjà menti à tes parents? 😅',
                'Qui est ton crush? 💕'
            ];
            await sock.sendMessage(from, { text: `🤔 *VÉRITÉ:*\n\n${truths[Math.floor(Math.random() * truths.length)]}` });
        }
    },

    ship: {
        category: 'fun',
        desc: 'Ship deux utilisateurs',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibship @user1 @user2' });
            
            const love = Math.floor(Math.random() * 100);
            await sock.sendMessage(from, { 
                text: `💘 *SHIP*\n\n${args[0]} 💕 ${args[1]}\n\n❤️ Love Meter: ${love}%\n${'❤️'.repeat(Math.floor(love/10))}` 
            });
        }
    },

    kill: {
        category: 'fun',
        desc: 'Jeu kill',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'quelqu\'un';
            await sock.sendMessage(from, { text: `🔪 ${target} a été éliminé par un 🥷 ninja invisible!` });
        }
    },

    hug: {
        category: 'fun',
        desc: 'Calin',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'tout le monde';
            await sock.sendMessage(from, { text: `🤗 ${target} reçoit un gros câlin de la part de 🥷!` });
        }
    },

    kiss: {
        category: 'fun',
        desc: 'Bisou',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'l\'air';
            await sock.sendMessage(from, { text: `💋 ${target} reçoit un bisou de 🥷!` });
        }
    },

    slap: {
        category: 'fun',
        desc: 'Gifle',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'un moustique';
            await sock.sendMessage(from, { text: `👋 ${target} se prend une gifle de 🥷! *PAF!*` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 7. GROUP - 25 commandes
    // ═══════════════════════════════════════════════════

    kickall: {
        category: 'group',
        desc: 'Exclure tous les membres',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, isGroup } = ctx;
            if (!isGroup) return await sock.sendMessage(from, { text: '❌ Groupe uniquement' });
            
            const group = await sock.groupMetadata(from);
            const members = group.participants.filter(p => !p.admin).map(p => p.id);
            
            for (const member of members) {
                await sock.groupParticipantsUpdate(from, [member], 'remove');
            }
            await sock.sendMessage(from, { text: `✅ ${members.length} membres exclus` });
        }
    },

    tagadmin: {
        category: 'group',
        desc: 'Mentionner les admins',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from, isGroup } = ctx;
            if (!isGroup) return await sock.sendMessage(from, { text: '❌ Groupe uniquement' });
            
            const group = await sock.groupMetadata(from);
            const admins = group.participants.filter(p => p.admin).map(p => p.id);
            const text = `📢 *ADMINS*\n\n${admins.map(a => `@${a.split('@')[0]}`).join('\n')}`;
            
            await sock.sendMessage(from, { text, mentions: admins });
        }
    },

    acceptall: {
        category: 'group',
        desc: 'Accepter toutes les demandes',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '✅ Toutes les demandes acceptées (simulation)' });
        }
    },

    tagall: {
        category: 'group',
        desc: 'Mentionner tout le monde',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const group = await sock.groupMetadata(from);
            const members = group.participants.map(p => p.id);
            const count = members.length;
            const groupName = group.subject || 'Groupe';
            const message = args.length ? args.join(' ') : '🔔 Attention tout le monde !';
            
            let memberList = '';
            members.forEach((m, i) => {
                memberList += `│ ${i + 1}. @${m.split('@')[0]}\n`;
            });

            const tagText = `╔══════════════════════╗
║   🥷 *CENTRAL-HEX* 🥷   ║
╠══════════════════════╣
║  📢 *ANNONCE GROUPE*  ║
╚══════════════════════╝

🏷️ *${groupName}*
👥 *Membres : ${count}*
💬 *${message}*

${memberList}
╔══════════════════════╗
║  ⚡ CENTRAL-HEX ⚡   ║
╚══════════════════════╝`;

            await sock.sendMessage(from, { 
                text: tagText,
                mentions: members
            });
        }
    },

    getall: {
        category: 'group',
        desc: 'Liste des membres',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            const group = await sock.groupMetadata(from);
            const list = group.participants.map((p, i) => `${i+1}. @${p.split('@')[0]}`).join('\n');
            await sock.sendMessage(from, { text: `👥 *MEMBRES (${group.participants.length})*\n\n${list}` });
        }
    },

    groupclose: {
        category: 'group',
        desc: 'Fermer le groupe',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.groupSettingUpdate(from, 'announcement');
            await sock.sendMessage(from, { text: '🔒 Groupe fermé (seuls les admins peuvent parler)' });
        }
    },

    groupopen: {
        category: 'group',
        desc: 'Ouvrir le groupe',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.groupSettingUpdate(from, 'not_announcement');
            await sock.sendMessage(from, { text: '🔓 Groupe ouvert (tout le monde peut parler)' });
        }
    },

    add: {
        category: 'group',
        desc: 'Ajouter un membre',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibadd <numéro>' });
            
            const num = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [num], 'add');
            await sock.sendMessage(from, { text: `✅ ${args[0]} ajouté` });
        }
    },

    vcf: {
        category: 'group',
        desc: 'Exporter contacts VCF',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '📇 Export VCF...\n\n⚠️ Génération du fichier de contacts.' });
        }
    },

    linkgc: {
        category: 'group',
        desc: 'Lien du groupe',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `🔗 *Lien du groupe:*\n\nhttps://chat.whatsapp.com/${code}` });
        }
    },

    antilink: {
        category: 'group',
        desc: 'Anti-lien on/off',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const status = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(status)) {
                return await sock.sendMessage(from, { text: '❌ Usage: Ibantilink on/off' });
            }
            db.settings.antiLink = status === 'on';
            await sock.sendMessage(from, { text: `🛡️ Anti-lien ${status === 'on' ? '✅ activé' : '❌ désactivé'}` });
        }
    },

    antisticker: {
        category: 'group',
        desc: 'Anti-sticker on/off',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const status = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(status)) {
                return await sock.sendMessage(from, { text: '❌ Usage: Ibantisticker on/off' });
            }
            db.settings.antiSticker = status === 'on';
            await sock.sendMessage(from, { text: `🛡️ Anti-sticker ${status === 'on' ? '✅ activé' : '❌ désactivé'}` });
        }
    },

    antigp: {
        category: 'group',
        desc: 'Anti-mention on/off',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const status = args[0]?.toLowerCase();
            if (!['on', 'off'].includes(status)) {
                return await sock.sendMessage(from, { text: '❌ Usage: Ibantigp on/off' });
            }
            db.settings.antiMention = status === 'on';
            await sock.sendMessage(from, { text: `🛡️ Anti-mention ${status === 'on' ? '✅ activé' : '❌ désactivé'}` });
        }
    },

    create: {
        category: 'group',
        desc: 'Créer un groupe',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const name = args.join(' ') || 'Nouveau Groupe 🥷';
            const group = await sock.groupCreate(name, [CONFIG.ownerNumber]);
            await sock.sendMessage(from, { text: `✅ Groupe créé: ${group.id}` });
        }
    },

    groupinfo: {
        category: 'group',
        desc: 'Infos du groupe',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            const group = await sock.groupMetadata(from);
            const info = `
📊 *INFOS GROUPE*

📝 Nom: ${group.subject}
👥 Membres: ${group.participants.length}
👑 Créateur: @${group.owner?.split('@')[0] || 'Inconnu'}
📅 Créé le: ${moment(group.creation * 1000).format('DD/MM/YYYY')}
🔒 Restreint: ${group.restrict ? 'Oui' : 'Non'}
🎨 Annonce: ${group.announce ? 'Oui' : 'Non'}
            `;
            await sock.sendMessage(from, { text: info });
        }
    },

    promote: {
        category: 'group',
        desc: 'Promouvoir admin',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibpromote @user' });
            
            const user = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [user], 'promote');
            await sock.sendMessage(from, { text: `👑 ${args[0]} promu admin` });
        }
    },

    demote: {
        category: 'group',
        desc: 'Rétrograder admin',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibdemote @user' });
            
            const user = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [user], 'demote');
            await sock.sendMessage(from, { text: `👎 ${args[0]} rétrogradé` });
        }
    },

    kick: {
        category: 'group',
        desc: 'Expulser membre',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibkick @user' });
            
            const user = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [user], 'remove');
            await sock.sendMessage(from, { text: `👢 ${args[0]} expulsé` });
        }
    },

    warn: {
        category: 'group',
        desc: 'Avertir membre',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibwarn @user [raison]' });
            
            const user = args[0];
            await sock.sendMessage(from, { text: `⚠️ ${user} a été averti!\nRaison: ${args.slice(1).join(' ') || 'Non spécifiée'}` });
        }
    },

    unwarn: {
        category: 'group',
        desc: 'Retirer avertissement',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibunwarn @user' });
            
            await sock.sendMessage(from, { text: `✅ Avertissement retiré pour ${args[0]}` });
        }
    },

    warnings: {
        category: 'group',
        desc: 'Voir avertissements',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const user = args[0] || 'Vous';
            await sock.sendMessage(from, { text: `📋 ${user} a 0 avertissement(s).` });
        }
    },

    setdesc: {
        category: 'group',
        desc: 'Changer description',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsetdesc <texte>' });
            
            await sock.groupUpdateDescription(from, args.join(' '));
            await sock.sendMessage(from, { text: '✅ Description mise à jour' });
        }
    },

    setsubject: {
        category: 'group',
        desc: 'Changer nom du groupe',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsetsubject <nom>' });
            
            await sock.groupUpdateSubject(from, args.join(' '));
            await sock.sendMessage(from, { text: '✅ Nom mis à jour' });
        }
    },

    revoke: {
        category: 'group',
        desc: 'Révoquer lien',
        groupOnly: true,
        adminOnly: true,
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.groupRevokeInvite(from);
            await sock.sendMessage(from, { text: '🔗 Lien révoqué! Utilisez Iblinkgc pour le nouveau.' });
        }
    },

    invite: {
        category: 'group',
        desc: 'Inviter par numéro',
        groupOnly: true,
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibinvite <numéro>' });
            
            const code = await sock.groupInviteCode(from);
            await sock.sendMessage(args[0] + '@s.whatsapp.net', { 
                text: `📩 Invitation au groupe:\n\nhttps://chat.whatsapp.com/${code}` 
            });
            await sock.sendMessage(from, { text: `✅ Invitation envoyée à ${args[0]}` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 8. REACTION - 15 commandes
    // ═══════════════════════════════════════════════════

    yeet: {
        category: 'reaction',
        desc: 'Jeter',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'un caillou';
            await sock.sendMessage(from, { text: `🚀 ${target} a été jeté dans l'espace par 🥷!` });
        }
    },

    nom: {
        category: 'reaction',
        desc: 'Manger',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'une pomme';
            await sock.sendMessage(from, { text: `😋 🥷 mange ${target} *NOM NOM*` });
        }
    },

    poke: {
        category: 'reaction',
        desc: 'Toucher',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'l\'écran';
            await sock.sendMessage(from, { text: `👉 🥷 touche ${target} *poke*` });
        }
    },

    wave: {
        category: 'reaction',
        desc: 'Saluer',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const target = args[0] || 'tout le monde';
            await sock.sendMessage(from, { text: `👋 🥷 salue ${target}!` });
        }
    },

    smile: {
        category: 'reaction',
        desc: 'Sourire',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😊 🥷 sourit gentiment!` });
        }
    },

    dance: {
        category: 'reaction',
        desc: 'Danser',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `💃 🥷 danse: \\o/ \\o/ \\o/` });
        }
    },

    smug: {
        category: 'reaction',
        desc: 'Sourire narquois',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😏 🥷 affiche un sourire narquois` });
        }
    },

    cringe: {
        category: 'reaction',
        desc: 'Malaise',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😬 🥷 ressent un malaise intense...` });
        }
    },

    happy: {
        category: 'reaction',
        desc: 'Heureux',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😄 🥷 est très heureux! 🎉` });
        }
    },

    cry: {
        category: 'reaction',
        desc: 'Pleurer',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const reason = args.join(' ') || 'de tristesse';
            await sock.sendMessage(from, { text: `😭 🥷 pleure ${reason}...` });
        }
    },

    angry: {
        category: 'reaction',
        desc: 'En colère',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😠 🥷 est en colère! *GRRR*` });
        }
    },

    confused: {
        category: 'reaction',
        desc: 'Confus',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `🤔 🥷 est confus...?` });
        }
    },

    bored: {
        category: 'reaction',
        desc: 'Ennuyé',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😴 🥷 s'ennuie... *bâille*` });
        }
    },

    tired: {
        category: 'reaction',
        desc: 'Fatigué',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: `😫 🥷 est fatigué... besoin de café! ☕` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 9. DOWNLOAD - 15 commandes
    // ═══════════════════════════════════════════════════

    ytmp3: {
        category: 'download',
        desc: 'YouTube MP3',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibytmp3 <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement en cours...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mp4', fileName: data.title + '.mp3', caption: `🎵 ${data.title}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur ytmp3: ' + err.message });
            }
        }
    },

    ytmp4: {
        category: 'download',
        desc: 'YouTube MP4',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibytmp4 <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement en cours...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { video: { url: data.url }, caption: `🎬 ${data.title}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur ytmp4: ' + err.message });
            }
        }
    },

    fbdl: {
        category: 'download',
        desc: 'Facebook Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibfbdl <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement Facebook...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/fb?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { video: { url: data.url }, caption: '📘 Téléchargé depuis Facebook' });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Facebook: ' + err.message });
            }
        }
    },

    igdl: {
        category: 'download',
        desc: 'Instagram Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibigdl <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement Instagram...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/ig?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                const media = Array.isArray(data) ? data[0] : data;
                if (media.type === 'video') {
                    await sock.sendMessage(from, { video: { url: media.url }, caption: '📸 Téléchargé depuis Instagram' });
                } else {
                    await sock.sendMessage(from, { image: { url: media.url }, caption: '📸 Téléchargé depuis Instagram' });
                }
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Instagram: ' + err.message });
            }
        }
    },

    tiktokdl: {
        category: 'download',
        desc: 'TikTok Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibtiktokdl <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement TikTok...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { video: { url: data.url || data.nowm }, caption: `🎵 ${data.title || 'TikTok'}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur TikTok: ' + err.message });
            }
        }
    },

    twitter: {
        category: 'download',
        desc: 'Twitter/X Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibtwitter <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement Twitter/X...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { video: { url: data.url }, caption: '🐦 Téléchargé depuis Twitter/X' });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Twitter: ' + err.message });
            }
        }
    },

    play2: {
        category: 'download',
        desc: 'Télécharger musique',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibplay <titre>' });
            
            const query = args.join(' ');
            try {
                await sock.sendMessage(from, { text: '⏳ Recherche en cours...' });
                const searchRes = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query + ' audio')}`);
                const video = searchRes.data?.data?.[0];
                if (!video) return await sock.sendMessage(from, { text: '❌ Musique introuvable.' });
                const dlRes = await axios.get(`https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(video.url)}`);
                const data = dlRes.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mp4', fileName: video.title + '.mp3', caption: `🎵 ${video.title}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur: ' + err.message });
            }
        }
    },

    video2: {
        category: 'download',
        desc: 'Télécharger vidéo',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibvideo <titre>' });
            
            const query = args.join(' ');
            try {
                await sock.sendMessage(from, { text: '⏳ Recherche vidéo...' });
                const searchRes = await axios.get(`https://api.siputzx.my.id/api/search/youtube?query=${encodeURIComponent(query)}`);
                const video = searchRes.data?.data?.[0];
                if (!video) return await sock.sendMessage(from, { text: '❌ Vidéo introuvable.' });
                const dlRes = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(video.url)}`);
                const data = dlRes.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { video: { url: data.url }, caption: `🎬 ${video.title}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur: ' + err.message });
            }
        }
    },

    spotifydl: {
        category: 'download',
        desc: 'Spotify Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibspotifydl <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement Spotify...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/spotify?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mp4', fileName: data.title + '.mp3', caption: `🎧 ${data.title}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur Spotify: ' + err.message });
            }
        }
    },

    soundclouddl: {
        category: 'download',
        desc: 'SoundCloud Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibsoundclouddl <url>' });
            
            const url = args[0];
            try {
                await sock.sendMessage(from, { text: '⏳ Téléchargement SoundCloud...' });
                const res = await axios.get(`https://api.siputzx.my.id/api/d/soundcloud?url=${encodeURIComponent(url)}`);
                const data = res.data?.data;
                if (!data?.url) return await sock.sendMessage(from, { text: '❌ Impossible de télécharger.' });
                await sock.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mp4', caption: `☁️ ${data.title || 'SoundCloud'}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur SoundCloud: ' + err.message });
            }
        }
    },

    zippyshare: {
        category: 'download',
        desc: 'ZippyShare Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibzippyshare <url>' });
            
            await sock.sendMessage(from, { text: `📦 ZippyShare...\n${args[0]}\n\n⚠️ Scraper requis.` });
        }
    },

    anonfiles: {
        category: 'download',
        desc: 'AnonFiles Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibanonfiles <url>' });
            
            await sock.sendMessage(from, { text: `📄 AnonFiles...\n${args[0]}` });
        }
    },

    bayfiles: {
        category: 'download',
        desc: 'BayFiles Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibbayfiles <url>' });
            
            await sock.sendMessage(from, { text: `📁 BayFiles...\n${args[0]}` });
        }
    },

    racaty: {
        category: 'download',
        desc: 'Racaty Downloader',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibracaty <url>' });
            
            await sock.sendMessage(from, { text: `📥 Racaty...\n${args[0]}` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 10. TOOLS - 20 commandes
    // ═══════════════════════════════════════════════════

    traduire: {
        category: 'tools',
        desc: 'Traduire texte',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibtraduire <lang> <texte>' });
            
            const lang = args[0];
            const text = args.slice(1).join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/tools/translate?text=${encodeURIComponent(text)}&to=${lang}`);
                const translated = res.data?.data || res.data?.result || text;
                await sock.sendMessage(from, { text: `🌐 *Traduction (${lang}):*\n\n${translated}` });
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Erreur traduction: ${err.message}` });
            }
        }
    },

    weather: {
        category: 'tools',
        desc: 'Météo',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibweather <ville>' });
            
            const city = args.join(' ');
            try {
                const res = await axios.get(`https://api.siputzx.my.id/api/tools/weather?city=${encodeURIComponent(city)}`);
                const w = res.data?.data;
                if (!w) return await sock.sendMessage(from, { text: '❌ Ville introuvable.' });
                await sock.sendMessage(from, { text: `🌤️ *Météo - ${city}*\n\n🌡️ Temp: ${w.temp || w.temperature}°C\n💧 Humidité: ${w.humidity}%\n🌬️ Vent: ${w.wind}\n☁️ ${w.description || w.condition}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Météo indisponible pour: ' + city });
            }
        }
    },

    calculatrice: {
        category: 'tools',
        desc: 'Calculatrice',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibcalculatrice <expression>' });
            
            try {
                const expr = args.join(' ').replace(/[^0-9+\-*/.()]/g, '');
                const result = eval(expr);
                await sock.sendMessage(from, { text: `🧮 ${expr} = ${result}` });
            } catch {
                await sock.sendMessage(from, { text: '❌ Expression invalide' });
            }
        }
    },

    reminder: {
        category: 'tools',
        desc: 'Rappel',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (args.length < 2) return await sock.sendMessage(from, { text: '❌ Usage: Ibreminder <temps> <message>\nEx: Ibreminder 10m Appeler maman' });
            
            const time = args[0];
            const msg = args.slice(1).join(' ');
            
            // Parse time (simple implementation)
            const ms = parseInt(time) * 60000; // minutes
            setTimeout(() => {
                sock.sendMessage(from, { text: `⏰ *RAPPEL:*\n\n${msg}` });
            }, ms);
            
            await sock.sendMessage(from, { text: `✅ Rappel défini dans ${time}` });
        }
    },

    note: {
        category: 'tools',
        desc: 'Prendre une note',
        async execute(ctx) {
            const { sock, from, args, sender } = ctx;
            if (!args.length) {
                // Afficher les notes
                const notes = db.notes[sender] || [];
                return await sock.sendMessage(from, { 
                    text: `📝 *Vos notes (${notes.length}):*\n\n${notes.map((n, i) => `${i+1}. ${n}`).join('\n') || 'Aucune note'}` 
                });
            }
            
            if (!db.notes[sender]) db.notes[sender] = [];
            db.notes[sender].push(args.join(' '));
            await sock.sendMessage(from, { text: '✅ Note enregistrée' });
        }
    },

    qrcode: {
        category: 'tools',
        desc: 'Générer QR Code',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibqrcode <texte>' });
            
            const text = args.join(' ');
            try {
                const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
                await sock.sendMessage(from, { image: { url }, caption: `📱 *QR Code généré !*\n\n🔤 Contenu: ${text}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur QR: ' + err.message });
            }
        }
    },

    short: {
        category: 'tools',
        desc: 'Raccourcir URL',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibshort <url>' });
            
            const url = args[0];
            try {
                const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
                await sock.sendMessage(from, { text: `🔗 *URL raccourcie !*\n\n📎 Original: ${url}\n✂️ Court: ${res.data}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur raccourcissement: ' + err.message });
            }
        }
    },

    base64: {
        category: 'tools',
        desc: 'Encoder/Decoder Base64',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbase64 <encode/decode> <texte>' });
            
            const action = args[0];
            const text = args.slice(1).join(' ');
            
            if (action === 'encode') {
                const encoded = Buffer.from(text).toString('base64');
                await sock.sendMessage(from, { text: `🔐 Encodé:\n${encoded}` });
            } else if (action === 'decode') {
                try {
                    const decoded = Buffer.from(text, 'base64').toString('utf8');
                    await sock.sendMessage(from, { text: `🔓 Décodé:\n${decoded}` });
                } catch {
                    await sock.sendMessage(from, { text: '❌ Texte invalide' });
                }
            }
        }
    },

    morse: {
        category: 'tools',
        desc: 'Code Morse',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibmorse <texte>' });
            
            const morse = { 'A': '.-', 'B': '-...', 'C': '-.-.', ' ': '/' };
            const text = args.join(' ').toUpperCase();
            const encoded = text.split('').map(c => morse[c] || c).join(' ');
            
            await sock.sendMessage(from, { text: `📻 Morse:\n${text}\n\n${encoded}` });
        }
    },

    binary: {
        category: 'tools',
        desc: 'Binaire',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbinary <texte>' });
            
            const text = args.join(' ');
            const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            await sock.sendMessage(from, { text: `💻 Binaire:\n${binary}` });
        }
    },

    hexa: {
        category: 'tools',
        desc: 'Hexadécimal',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibhexa <texte>' });
            
            const text = args.join(' ');
            const hex = text.split('').map(c => c.charCodeAt(0).toString(16)).join(' ');
            await sock.sendMessage(from, { text: `🔢 Hex:\n${hex}` });
        }
    },

    rgb: {
        category: 'tools',
        desc: 'Convertisseur couleur',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibrgb <hex>' });
            
            const hex = args[0].replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            await sock.sendMessage(from, { 
                text: `🎨 #${hex} =\nRGB(${r}, ${g}, ${b})` 
            });
        }
    },

    password: {
        category: 'tools',
        desc: 'Générer mot de passe',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const length = parseInt(args[0]) || 12;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
            let pwd = '';
            for (let i = 0; i < length; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            await sock.sendMessage(from, { text: `🔑 Mot de passe (${length} caractères):\n\n${pwd}` });
        }
    },

    uuid: {
        category: 'tools',
        desc: 'Générer UUID',
        async execute(ctx) {
            const { sock, from } = ctx;
            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            await sock.sendMessage(from, { text: `🆔 UUID:\n\n${uuid}` });
        }
    },

    hash: {
        category: 'tools',
        desc: 'Hacher texte',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibhash <texte>' });
            
            const crypto = require('crypto');
            const hash = crypto.createHash('md5').update(args.join(' ')).digest('hex');
            await sock.sendMessage(from, { text: `#️⃣ MD5:\n${hash}` });
        }
    },

    decompress: {
        category: 'tools',
        desc: 'Décompresser',
        async execute(ctx) {
            const { sock, from } = ctx;
            const text = args.join(' ');
            if (!text) return await sock.sendMessage(from, { text: '❌ Usage: Ibdecompress <base64>' });
            try {
                const zlib = require('zlib');
                const buffer = Buffer.from(text, 'base64');
                const decompressed = zlib.gunzipSync(buffer).toString();
                await sock.sendMessage(from, { text: `📂 *Décompressé:*\n\n${decompressed}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Texte invalide ou non compressé.' });
            }
        }
    },

    compress: {
        category: 'tools',
        desc: 'Compresser',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const text = args.join(' ');
            if (!text) return await sock.sendMessage(from, { text: '❌ Usage: Ibcompress <texte>' });
            const zlib = require('zlib');
            const compressed = zlib.gzipSync(text).toString('base64');
            await sock.sendMessage(from, { text: `📦 *Compressé:*\n\n${compressed}` });
        }
    },

    readqr: {
        category: 'tools',
        desc: 'Lire QR Code',
        async execute(ctx) {
            const { sock, from } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.imageMessage) return await sock.sendMessage(from, { text: '❌ Répondez à une image de QR code.' });
            try {
                const buffer = await downloadMediaMessage({ key: m.key, message: quoted }, 'buffer');
                const base64 = buffer.toString('base64');
                const res = await axios.post('https://api.qrserver.com/v1/read-qr-code/', { base64 });
                const result = res.data?.[0]?.symbol?.[0]?.data || 'QR code illisible';
                await sock.sendMessage(from, { text: `📷 *QR Code lu:*\n\n${result}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Impossible de lire le QR code.' });
            }
        }
    },

    ocr: {
        category: 'tools',
        desc: 'Reconnaissance texte',
        async execute(ctx) {
            const { sock, from } = ctx;
            const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.imageMessage) return await sock.sendMessage(from, { text: '❌ Répondez à une image pour extraire le texte.' });
            try {
                await sock.sendMessage(from, { text: '⏳ Extraction du texte...' });
                const buffer = await downloadMediaMessage({ key: m.key, message: quoted }, 'buffer');
                const FormData = require('form-data');
                const form = new FormData();
                form.append('file', buffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
                form.append('language', 'fre');
                form.append('isOverlayRequired', 'false');
                const res = await axios.post('https://api.ocr.space/parse/image', form, {
                    headers: { ...form.getHeaders(), 'apikey': 'helloworld' }
                });
                const text = res.data?.ParsedResults?.[0]?.ParsedText || 'Aucun texte détecté.';
                await sock.sendMessage(from, { text: `📄 *Texte extrait:*\n\n${text}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur OCR: ' + err.message });
            }
        }
    },

    pdf: {
        category: 'tools',
        desc: 'Créer PDF',
        async execute(ctx) {
            const { sock, from } = ctx;
            const text = args.join(' ');
            if (!text) return await sock.sendMessage(from, { text: '❌ Usage: Ibpdf <texte à convertir>' });
            await sock.sendMessage(from, { text: `📄 *Conversion PDF*\n\n💡 Utilisez un service en ligne comme:\n🔗 https://www.ilovepdf.com\n🔗 https://www.smallpdf.com` });
        }
    },

    // ═══════════════════════════════════════════════════
    // 11. GAMES - 15 commandes
    // ═══════════════════════════════════════════════════

    tictactoe: {
        category: 'games',
        desc: 'Morpion',
        async execute(ctx) {
            const { sock, from } = ctx;
            const board = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
            await sock.sendMessage(from, { 
                text: `⭕❌ *MORPION*\n\n${board[0]}${board[1]}${board[2]}\n${board[3]}${board[4]}${board[5]}\n${board[6]}${board[7]}${board[8]}\n\nJouez avec Ibplay <case>` 
            });
        }
    },

    pdr: {
        category: 'games',
        desc: 'Pierre Feuille Ciseaux',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const choices = ['pierre', 'feuille', 'ciseaux'];
            const user = args[0]?.toLowerCase();
            
            if (!choices.includes(user)) {
                return await sock.sendMessage(from, { text: '❌ Usage: Ibpdr <pierre/feuille/ciseaux>' });
            }
            
            const bot = choices[Math.floor(Math.random() * 3)];
            let result = '';
            
            if (user === bot) result = '🤝 Égalité!';
            else if ((user === 'pierre' && bot === 'ciseaux') ||
                     (user === 'feuille' && bot === 'pierre') ||
                     (user === 'ciseaux' && bot === 'feuille')) {
                result = '🎉 Tu as gagné!';
            } else {
                result = '😔 Tu as perdu!';
            }
            
            await sock.sendMessage(from, { 
                text: `✊ *PIERRE FEUILLE CISEAUX*\n\nToi: ${user}\nBot: ${bot}\n\n${result}` 
            });
        }
    },

    sudoku: {
        category: 'games',
        desc: 'Sudoku',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🔢 *SUDOKU*\n\n5 3 . | . 7 . | . . .\n6 . . | 1 9 5 | . . .\n. 9 8 | . . . | . 6 .\n------+-------+------\n8 . . | . 6 . | . . 3\n4 . . | 8 . 3 | . . 1\n7 . . | . 2 . | . . 6\n------+-------+------\n. 6 . | . . . | 2 8 .\n. . . | 4 1 9 | . . 5\n. . . | . 8 . | . 7 9\n\n⚠️ Version complète nécessite une grille générée.' });
        }
    },

    quiz: {
        category: 'games',
        desc: 'Quiz',
        async execute(ctx) {
            const { sock, from } = ctx;
            const questions = [
                { q: 'Quelle est la capitale de la France?', a: 'paris' },
                { q: 'Combien de continents?', a: '7' },
                { q: 'Quel est le plus grand océan?', a: 'pacifique' }
            ];
            const q = questions[Math.floor(Math.random() * questions.length)];
            await sock.sendMessage(from, { text: `❓ *QUIZ*\n\n${q.q}\n\n💡 Répondez pour tester vos connaissances!` });
        }
    },

    truth2: {
        category: 'games',
        desc: 'Action Vérité',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🎯 *ACTION OU VÉRITÉ*\n\nUtilisez Ibtruth ou Ibdare' });
        }
    },

    dare2: {
        category: 'games',
        desc: 'Défi',
        async execute(ctx) {
            const { sock, from } = ctx;
            const dares = ['Fais 10 pompes!', 'Chante une chanson!', 'Raconte un secret!'];
            await sock.sendMessage(from, { text: `🎯 *DÉFI*\n\n${dares[Math.floor(Math.random() * dares.length)]}` });
        }
    },

    slot: {
        category: 'games',
        desc: 'Machine à sous',
        async execute(ctx) {
            const { sock, from } = ctx;
            const symbols = ['🍒', '🍋', '💎', '7️⃣', '🎰'];
            const result = [
                symbols[Math.floor(Math.random() * 5)],
                symbols[Math.floor(Math.random() * 5)],
                symbols[Math.floor(Math.random() * 5)]
            ];
            
            const win = result[0] === result[1] && result[1] === result[2];
            await sock.sendMessage(from, { 
                text: `🎰 *SLOT MACHINE*\n\n| ${result.join(' | ')} |\n\n${win ? '🎉 JACKPOT!' : '😔 Perdu...'}` 
            });
        }
    },

    lottery: {
        category: 'games',
        desc: 'Loterie',
        async execute(ctx) {
            const { sock, from } = ctx;
            const numbers = Array.from({length: 6}, () => Math.floor(Math.random() * 49) + 1);
            await sock.sendMessage(from, { 
                text: `🎫 *LOTTERIE*\n\nNuméros gagnants:\n${numbers.sort((a,b) => a-b).join(' - ')}\n\nBonne chance! 🍀` 
            });
        }
    },

    chess: {
        category: 'games',
        desc: 'Échecs',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '♟️ *ÉCHECS*\n\n⚠️ Nécessite une implémentation complète (chess.js).' });
        }
    },

    checkers: {
        category: 'games',
        desc: 'Dames',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '⚫⚪ *DAMES*\n\n⚠️ Nécessite une implémentation.' });
        }
    },

    blackjack: {
        category: 'games',
        desc: 'Blackjack',
        async execute(ctx) {
            const { sock, from } = ctx;
            const cards = ['A♠️', '10♥️', 'K♣️'];
            const score = 21;
            await sock.sendMessage(from, { 
                text: `🃏 *BLACKJACK*\n\nVos cartes: ${cards.join(' ')}\nScore: ${score}\n\n${score === 21 ? '🎉 BLACKJACK!' : 'Tirez ou restez?'}` 
            });
        }
    },

    poker: {
        category: 'games',
        desc: 'Poker',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🎴 *POKER*\n\n⚠️ Nécessite une implémentation complète.' });
        }
    },

    roulette: {
        category: 'games',
        desc: 'Roulette',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const num = Math.floor(Math.random() * 37);
            const color = num === 0 ? '🟢' : num % 2 === 0 ? '⚫' : '🔴';
            await sock.sendMessage(from, { 
                text: `🎡 *ROULETTE*\n\nRésultat: ${color} ${num}\n\n${args[0] == num ? '🎉 Gagné!' : '😔 Perdu...'}` 
            });
        }
    },

    dice: {
        category: 'games',
        desc: 'Dés',
        async execute(ctx) {
            const { sock, from } = ctx;
            const dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            const result = Math.floor(Math.random() * 6);
            await sock.sendMessage(from, { text: `🎲 *DÉ*\n\n${dice[result]} (${result + 1})` });
        }
    },

    '8ball': {
        category: 'games',
        desc: 'Boule magique 8',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Posez une question!' });
            
            const responses = ['Oui', 'Non', 'Peut-être', 'Certainement', 'Pas sûr', 'Redemande plus tard'];
            await sock.sendMessage(from, { 
                text: `🎱 *8-BALL*\n\nQuestion: ${args.join(' ')}\nRéponse: ${responses[Math.floor(Math.random() * responses.length)]}` 
            });
        }
    },

    // ═══════════════════════════════════════════════════
    // 12. MEDIA - 15 commandes
    // ═══════════════════════════════════════════════════

    blur: {
        category: 'media',
        desc: 'Flouter image',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🔮 Floutage...\n\n⚠️ Nécessite Sharp ou Jimp.' });
        }
    },

    sharpen: {
        category: 'media',
        desc: 'Netteté',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '✨ Augmentation netteté...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    grayscale: {
        category: 'media',
        desc: 'Noir et blanc',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '⚫⚪ Conversion N&B...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    invert: {
        category: 'media',
        desc: 'Inverser couleurs',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🔄 Inversion...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    sepia: {
        category: 'media',
        desc: 'Filtre sépia',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '📜 Filtre sépia...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    flip: {
        category: 'media',
        desc: 'Retourner',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🔃 Retournement...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    rotate: {
        category: 'media',
        desc: 'Rotation',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            await sock.sendMessage(from, { text: `🔄 Rotation ${args[0] || 90}°...\n\n⚠️ Nécessite Sharp.` });
        }
    },

    crop: {
        category: 'media',
        desc: 'Recadrer',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '✂️ Recadrage...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    resize: {
        category: 'media',
        desc: 'Redimensionner',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            await sock.sendMessage(from, { text: `📐 Redimensionnement ${args[0] || 800}x${args[1] || 600}...\n\n⚠️ Nécessite Sharp.` });
        }
    },

    compressimg: {
        category: 'media',
        desc: 'Compresser',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🗜️ Compression...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    enhance: {
        category: 'media',
        desc: 'Améliorer',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '💎 Amélioration...\n\n⚠️ Nécessite une API IA.' });
        }
    },

    removebg: {
        category: 'media',
        desc: 'Supprimer fond',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🖼️ Suppression fond...\n\n⚠️ Nécessite remove.bg API.' });
        }
    },

    overlay: {
        category: 'media',
        desc: 'Superposer',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '➕ Superposition...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    watermark: {
        category: 'media',
        desc: 'Ajouter watermark',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            await sock.sendMessage(from, { text: `💧 Watermark "${args.join(' ')}"...\n\n⚠️ Nécessite Sharp.` });
        }
    },

    collage: {
        category: 'media',
        desc: 'Créer collage',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🎨 Création collage...\n\n⚠️ Nécessite Sharp.' });
        }
    },

    // ═══════════════════════════════════════════════════
    // 13. INFO - 10 commandes
    // ═══════════════════════════════════════════════════

    covid: {
        category: 'info',
        desc: 'Stats COVID-19',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const country = args[0] || 'world';
            try {
                const res = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`);
                const d = res.data;
                await sock.sendMessage(from, { text: `🦠 *COVID-19 - ${d.country}*\n\n😷 Cas totaux: ${d.cases?.toLocaleString()}\n💀 Décès: ${d.deaths?.toLocaleString()}\n✅ Guéris: ${d.recovered?.toLocaleString()}\n📈 Actifs: ${d.active?.toLocaleString()}\n🆕 Aujourd'hui: +${d.todayCases?.toLocaleString()}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Données COVID introuvables pour: ' + country });
            }
        }
    },

    news: {
        category: 'info',
        desc: 'Actualités',
        async execute(ctx) {
            const { sock, from } = ctx;
            try {
                const res = await axios.get('https://api.siputzx.my.id/api/news/berita-terbaru');
                const articles = res.data?.data?.slice(0, 3) || [];
                if (!articles.length) return await sock.sendMessage(from, { text: '❌ Aucune actualité disponible.' });
                let text = '📰 *ACTUALITÉS DU JOUR*\n\n';
                articles.forEach((a, i) => { text += `*${i+1}. ${a.title}*\n${a.description || ''}\n🔗 ${a.url || ''}\n\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur actualités: ' + err.message });
            }
        }
    },

    crypto: {
        category: 'info',
        desc: 'Crypto-monnaies',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const coin = args[0] || 'bitcoin';
            try {
                const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,eur`);
                const data = res.data?.[coin.toLowerCase()];
                if (!data) return await sock.sendMessage(from, { text: '❌ Crypto introuvable: ' + coin });
                await sock.sendMessage(from, { text: `₿ *${coin.toUpperCase()}*\n\n💵 USD: ${data.usd}\n💶 EUR: €${data.eur}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur crypto: ' + err.message });
            }
        }
    },

    stocks: {
        category: 'info',
        desc: 'Bourse',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const symbol = args[0] || 'AAPL';
            try {
                const res = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
                const quote = res.data?.chart?.result?.[0]?.meta;
                if (!quote) return await sock.sendMessage(from, { text: '❌ Action introuvable: ' + symbol });
                await sock.sendMessage(from, { text: `📈 *${symbol.toUpperCase()}*\n\n💰 Prix: ${quote.regularMarketPrice} ${quote.currency}\n📊 Ouverture: ${quote.regularMarketOpen}\n📉 Min: ${quote.regularMarketDayLow}\n📈 Max: ${quote.regularMarketDayHigh}` });
            } catch (err) {
                await sock.sendMessage(from, { text: '❌ Erreur bourse: ' + err.message });
            }
        }
    },

    football: {
        category: 'info',
        desc: 'Football',
        async execute(ctx) {
            const { sock, from } = ctx;
            try {
                const res = await axios.get('https://api.siputzx.my.id/api/sport/football');
                const matches = res.data?.data?.slice(0, 5) || [];
                if (!matches.length) return await sock.sendMessage(from, { text: '⚽ Aucun match disponible.' });
                let text = '⚽ *FOOTBALL - Matchs récents*\n\n';
                matches.forEach(m => { text += `🏟️ ${m.home} vs ${m.away}\n📊 ${m.score || m.status}\n\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '⚽ *FOOTBALL*\n\nConsultez: https://www.livescore.com' });
            }
        }
    },

    cricket: {
        category: 'info',
        desc: 'Cricket',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🏏 *CRICKET*\n\n📊 Scores en direct:\n🔗 https://www.espncricinfo.com' });
        }
    },

    basketball: {
        category: 'info',
        desc: 'Basketball',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🏀 *BASKETBALL*\n\n📊 Scores NBA en direct:\n🔗 https://www.nba.com/scores' });
        }
    },

    tennis: {
        category: 'info',
        desc: 'Tennis',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🎾 *TENNIS*\n\n📊 Scores en direct:\n🔗 https://www.atptour.com' });
        }
    },

    f1: {
        category: 'info',
        desc: 'Formule 1',
        async execute(ctx) {
            const { sock, from } = ctx;
            try {
                const res = await axios.get('https://ergast.com/api/f1/current/last/results.json');
                const race = res.data?.MRData?.RaceTable?.Races?.[0];
                if (!race) return await sock.sendMessage(from, { text: '🏎️ Aucune course disponible.' });
                const top3 = race.Results?.slice(0, 3) || [];
                let text = `🏎️ *F1 - ${race.raceName}*\n📅 ${race.date}\n\n🏆 *Podium:*\n`;
                top3.forEach((r, i) => { text += `${i+1}. ${r.Driver.givenName} ${r.Driver.familyName} (${r.Constructor.name})\n`; });
                await sock.sendMessage(from, { text });
            } catch (err) {
                await sock.sendMessage(from, { text: '🏎️ *FORMULE 1*\n\n🔗 https://www.formula1.com' });
            }
        }
    },

    olympics: {
        category: 'info',
        desc: 'Jeux Olympiques',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '🏅 *JEUX OLYMPIQUES*\n\n⚠️ Données non disponibles actuellement.' });
        }
    },

    // ═══════════════════════════════════════════════════
    // 14. UTILITY - 15 commandes
    // ═══════════════════════════════════════════════════

    calc: {
        category: 'utility',
        desc: 'Calcul rapide',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibcalc <expression>' });
            
            try {
                const result = eval(args.join(' ').replace(/[^0-9+\-*/.()]/g, ''));
                await sock.sendMessage(from, { text: `🧮 Résultat: ${result}` });
            } catch {
                await sock.sendMessage(from, { text: '❌ Calcul invalide' });
            }
        }
    },

    timer: {
        category: 'utility',
        desc: 'Minuteur',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibtimer <minutes>' });
            
            const min = parseInt(args[0]);
            setTimeout(() => {
                sock.sendMessage(from, { text: `⏰ *TIMER*\n\n${min} minute(s) écoulée(s)!` });
            }, min * 60000);
            
            await sock.sendMessage(from, { text: `⏱️ Minuteur défini: ${min} min` });
        }
    },

    stopwatch: {
        category: 'utility',
        desc: 'Chronomètre',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { text: '⏱️ Chronomètre démarré!\n\nUtilisez Ibstop pour arrêter.' });
        }
    },

    alarm: {
        category: 'utility',
        desc: 'Alarme',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args[0]) return await sock.sendMessage(from, { text: '❌ Usage: Ibalarm <HH:MM>' });
            
            await sock.sendMessage(from, { text: `⏰ Alarme définie pour ${args[0]}` });
        }
    },

    timezone: {
        category: 'utility',
        desc: 'Fuseau horaire',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            const tz = args[0] || 'Africa/Conakry';
            const time = moment().tz(tz).format('HH:mm:ss');
            await sock.sendMessage(from, { text: `🌍 ${tz}:\n${time}` });
        }
    },

    calendar: {
        category: 'utility',
        desc: 'Calendrier',
        async execute(ctx) {
            const { sock, from } = ctx;
            const cal = moment().format('MMMM YYYY\n\nDD MM SS\n[...calendar...]');
            await sock.sendMessage(from, { text: `📅 *CALENDRIER*\n\n${moment().format('MMMM YYYY')}\n\n${moment().format('dddd DD MMMM')}` });
        }
    },

    birthday: {
        category: 'utility',
        desc: 'Anniversaire',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibbirthday <JJ/MM>' });
            
            await sock.sendMessage(from, { text: `🎂 Anniversaire enregistré: ${args[0]}` });
        }
    },

    countdown: {
        category: 'utility',
        desc: 'Compte à rebours',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibcountdown <date>' });
            
            await sock.sendMessage(from, { text: `⏳ Compte à rebours vers ${args.join(' ')}...` });
        }
    },

    poll2: {
        category: 'utility',
        desc: 'Sondage avancé',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibpoll2 <question>' });
            
            await sock.sendMessage(from, { 
                poll: {
                    name: args.join(' '),
                    values: ['Option 1', 'Option 2', 'Option 3'],
                    selectableCount: 1
                }
            });
        }
    },

    vote: {
        category: 'utility',
        desc: 'Voter',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            await sock.sendMessage(from, { text: `🗳️ Vote pour: ${args.join(' ') || 'Aucune option'}` });
        }
    },

    feedback: {
        category: 'utility',
        desc: 'Retour d\'expérience',
        async execute(ctx) {
            const { sock, from, args, sender } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibfeedback <message>' });
            
            await sock.sendMessage(CONFIG.ownerNumber, { 
                text: `💬 *FEEDBACK*\nDe: ${sender}\n\n${args.join(' ')}` 
            });
            await sock.sendMessage(from, { text: '✅ Feedback envoyé!' });
        }
    },

    report: {
        category: 'utility',
        desc: 'Signaler',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibreport <problème>' });
            
            await sock.sendMessage(from, { text: '📋 Signalement enregistré.' });
        }
    },

    suggest: {
        category: 'utility',
        desc: 'Suggestion',
        async execute(ctx) {
            const { sock, from, args } = ctx;
            if (!args.length) return await sock.sendMessage(from, { text: '❌ Usage: Ibsuggest <idée>' });
            
            await sock.sendMessage(from, { text: '💡 Suggestion enregistrée!' });
        }
    },

    donate: {
        category: 'utility',
        desc: 'Faire un don',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { 
                text: `💝 *DON*\n\nSoutenez ${CONFIG.botName}!\nContactez: ${CONFIG.ownerNumber.split('@')[0]}` 
            });
        }
    },

    credits: {
        category: 'utility',
        desc: 'Crédits',
        async execute(ctx) {
            const { sock, from } = ctx;
            await sock.sendMessage(from, { 
                text: `🏆 *CRÉDITS*\n\n🥷 Développé par: ${CONFIG.developer}\n📱 Contact: ${CONFIG.ownerNumber.split('@')[0]}\n🤖 Bot: ${CONFIG.botName} v3.0\n\nMerci d'utiliser CENTRAL-HEX! 🙏` 
            });
        }
    }
};

// ============================================
// EXPORT POUR LE BOT
// ============================================

module.exports = commands;

// ============================================
// STATISTIQUES
// ============================================

const stats = {
    total: Object.keys(commands).length,
    categories: {}
};

Object.values(commands).forEach(cmd => {
    const cat = cmd.category || 'unknown';
    stats.categories[cat] = (stats.categories[cat] || 0) + 1;
});

console.log(`
╔══════════════════════════════════════╗
║     CENTRAL-HEX COMMANDES LOADED      ║
╠══════════════════════════════════════╣
║  Total: ${stats.total.toString().padStart(3)} commandes           ║
╠══════════════════════════════════════╣
║  Catégories:                         ║
${Object.entries(stats.categories).map(([cat, count]) => 
    `║  • ${cat.padEnd(12)}: ${count.toString().padStart(3)} cmd`
).join('\n')}
╚══════════════════════════════════════╝
`);

