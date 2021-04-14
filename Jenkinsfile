@NonCPS

def repositoryName  = 'base_api'
def jenkinsURL      = 'https://jenkins.citronium.com/view/Base/job/base_api_deploy/'
def chatId          = ''
def token           = ''

def imageTag        = env.BRANCH_NAME
def ecRegistry      = "https://registry.citronium.com/v2/${repositoryName}"
def remoteImageTag

node {
    try {
      stage("Checkout") {
        checkout scm
        def commit_hash = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
        def now = new Date()
        remoteImageTag = "${now.format('yyMMdd', TimeZone.getTimeZone('UTC'))}_${imageTag}_${BUILD_NUMBER}_${commit_hash}"
      }

      stage("Start") {
        sendMessage("☑ Build №${env.BUILD_NUMBER}: Start ${remoteImageTag} ${env.JOB_URL} ${sendChangeLogs()}")
      }

      stage("Build") {
        sh "docker build -t ${repositoryName}:${remoteImageTag} ."
      }

      stage("Push") {
        docker.withRegistry(ecRegistry, 'd1eacb00-afb9-4a2c-9fb5-f4c2761c8084') {
          docker.image("${repositoryName}:${remoteImageTag}").push(remoteImageTag)
        }
      }

      stage("Finish") {
        sendMessage("🛠✅ Build ${repositoryName} №${env.BUILD_NUMBER}: ${remoteImageTag}. Finish. Deploy: https://${jenkinsURL}/job/api_deploy/")
      }

    } catch(e) {
      sendMessage("🛠❌ Build ${repositoryName} №${env.BUILD_NUMBER}: Error ${remoteImageTag} ${e}")
      throw e
    }
}

def sendChangeLogs() {
    def commitMessages = ""
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            commitMessages = commitMessages + "\n> ${entry.author}: ${entry.msg} "
        }
    }
    return commitMessages
}

def sendMessage(message) {
    //sh(returnStdout: false, script: "curl -X POST -H 'Content-Type: application/json' -d '{\"chat_id\": \"${chatId}\", \"text\": \"${message}\", \"disable_notification\": true}' https://api.telegram.org/bot${token}/sendMessage")
}
