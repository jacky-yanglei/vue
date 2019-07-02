<template>
  <div class="backup-recovery">
    <h5 class="title">{{ $t('i18n.BACKUP_AND_RECOVERY') }}</h5>
    <div class="container">
      <p class="tip">{{ $t('i18n.LIANJIBAO_BACKUP_DESCRIPTION') }}</p>
      <button type="button" class="backup-btn">
        {{ $t('i18n.BACKUP_CONFIGURATION') }}
      </button>
      <div class="upload-wrapper">
        <div class="upload-btn" @click="chooseFile">{{ $t('i18n.CHOOSE_FILE') }}</div>
        <input
        type="file"
        name="file"
        hidden
        ref="inputFile"
        @change="showFileName">
        <span
        class="dis"
        :title="fileName">{{ fileName }}</span>
      </div>
      <button type="button" class="recovery-btn">
        {{ $t('i18n.IMPORT_CONFIGURATION') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'backupAndRecovery',
  data() {
    return {
      fileName: this.$t('i18n.NO_FILES_ARE_SELECTED')
    }
  },
  methods: {
    chooseFile() {
      this.$refs.inputFile.click()
    },
    showFileName(e) {
      if (e.srcElement.files.length) {
        this.fileName = e.srcElement.files[0].name
      } else {
        this.fileName = this.$t('i18n.NO_FILES_ARE_SELECTED')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_constant';
@import '../../../../common/sass/_mixin';

.backup-recovery {
  width: 100%;
  border-radius: $startContentRaduis;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  .title {
    padding-left: 30px;
    height: 76px;
    color: rgba(58, 56, 72, 1);
    font-size: 20px;
    line-height: 76px;
    background: white;
    font-weight: bold;
  }
  .container {
    padding: 40px 60px 60px 60px;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    .tip {
      font-size:14px;
      color:rgba(58,56,72,1);
      margin-bottom: 40px;
    }
    .backup-btn {
      @include startBtn-primaryHover();

      width: 100%;
      height: 56px;
    }
    .upload-wrapper {
      display: flex;
      align-items: center;
      margin-top: 40px;
      .upload-btn {
        margin-right: 20px;
        width:90px;
        height:30px;
        border: 1px solid #D8D8D8;
        border-radius: 4px ;
        background:linear-gradient(180deg,rgba(255,255,255,1),rgba(245,245,245,1));
        box-shadow: 0px 2px 0px 0px rgba(255,255,255,1);
        color:rgba(117,115,139,1);
        text-align: center;
        font-size:12px;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          border: 1px solid #39C1FF;
          box-shadow: 0px 6px 20px 0px rgba(0,159,232,0.5);
        }
      }
      .dis {
        overflow: hidden;
        max-width: 265px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .recovery-btn {
      @include startBtn-primaryHover();

      width: 100%;
      height: 56px;
      margin-top: 40px;
    }
  }
}
</style>
