<?php

/* 
Template Name: Page accueil
Template Post Type: post, page, product
*/

get_header();
$size = 'full'; ?>




<section id="top">

    <div class="c">

        <div class="flex">

            <div class="titre">
                <h1><?php echo get_field('h1_home'); ?></h1>
            </div>

            <div class="txt">

                <p><?php echo get_field('txt_h1'); ?></p>

                <?php $btn_h1 = get_field('btn_h1');
                if ($btn_h1) : ?>
                    <a class="wp-block-button__link" href="<?php echo esc_url($btn_h1['url']); ?>" target="<?php echo esc_attr($btn_h1['target']); ?>"><?php echo esc_html($btn_h1['title']); ?></a>
                <?php endif; ?>

            </div>

        </div>

        <video autoplay muted loop playsinline>
            <source type="video/mp4" src="/wp-content/themes/baticeram/images/video.mp4">
        </video>

    </div>

</section>







<?php get_footer();
