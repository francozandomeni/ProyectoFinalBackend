import {  sendEmailToUserDeletedByAdmin } from "../config/gmail.js";
import { GetUserDto } from "../dao/dto/users.dto.js";
import userModel from "../dao/models/Users.models.js";
import { userService } from "../repository/index.js";

class UsersController {

  static getUsers = async (req, res) => {
    try {
      const users = await userService.getUsers()

      const usersMajorData = users.map(user => new GetUserDto(user))
      console.log(usersMajorData)
      res.status(200).send({ status: "success", payload: usersMajorData })

    } catch (error) {
      res.status(500).send({ status: "error", error: "error encontrando usuarios" })

    }
  }

  static deleteUser = async (req, res) => {
    const uid = req.body.uid;
    try {

      const user = await userService.getUserById(uid)
      console.log(`---GET USER ID:`, user)
      const deleteUser = await userService.deleteUser(user)

      console.log("---USUARIO ELIMINADO---",deleteUser)

      const userDeleted = await sendEmailToUserDeletedByAdmin(user.email);

      res.status(200).send({ status: "success", payload: deleteUser })


    } catch (error) {
      res.status(500).send({ status: "error", error: "error eliminando usuario" })

    }
  }

  static deleteUnactiveUsers = async (req, res) => {
    try {
      // const users = await userService.getUsers()

      // Obtener la fecha actual menos 10 minutos
      const tenMinutesAgo = new Date();
      tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

      // Consultar usuarios que no se han conectado en los últimos 10 minutos
      const inactiveUsers = await userModel.find({ last_connection: { $lt: tenMinutesAgo } });

      // Eliminar los usuarios encontrados
      await userModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

      inactiveUsers.forEach(async (user) => {
        await sendEmailToUserDeleted(user.email);
      });

      res.status(200).json({ status: "success", message: "Usuarios inactivos eliminados correctamente" });

    } catch (error) {
      res.status(500).send({ status: "error", error: "error eliminando usuarios" })

    }
  }


  static addDocuments = async (req, res) => {
    try {
      const uid = req.params.uid;
      const filename = req.file.filename
      const user = await userModel.findById(uid);

      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }

      if (!filename) {
        return res.status(400).send({ status: "error", error: "No se pudo cargar el documento" })
      }

      const document = {
        name: filename,
        reference: `http://localhost:8080/files/documents/${filename}`
      }

      user.documents.push(document)

      const result = await userService.updateUserById(uid, user);

      return res.status(200).json({ message: 'Documento subidos exitosamente', result });

    } catch (error) {
      console.error('Error uploading documents:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

  }

  static changeRol = async (req, res) => {
    try {
      //validacion de documentos
      const userId = req.params.uid;
      const user = await userService.getUserById(userId);
      const userRol = user.role;
      //Si el usuario tiene 3 documentos cargados, procede a hacerlo premium. Si no, sugiere que haga la carga
      if (userRol === "user") {
        if (user.documents.length === 3) {
          user.role = "premium"
        } else {
          return res.status(400).send(`<div>Debe de cargar la documentacion requerida para ser Premium. <a href="/:uid/documents">Subir documentacion</a> </div>`)
        }
        //si el usuario ya es premium, lo envia a otra url (no es funcional aun)
      } else if (userRol === "premium") {
        return res.status(400).send(`<div>Para dejar de ser usuario Premium <a href="/api/users/normal/:uid">haz click aqui</a></div>`)
      } else {
        return res.json({ status: "error", message: "no es posible cambiar el role del usuario" });
      }
      await userModel.updateOne({ _id: user._id }, user);
      res.send({ status: "success", message: "rol modificado" });
    } catch (error) {
      console.log(error.message);
      res.json({ status: "error", message: "hubo un error al cambiar el rol del usuario" })
    }
  }
  // static changeRol = async (req, res) => {
  //   try {
  //     const userId = req.params.uid;

  //     const user = await userService.getUserById(userId);
  //     const userRol = user.role;
  //     if (userRol === "user") {
  //       user.role = "admin"
  //     } else if (userRol === "admin") {
  //       user.role = "user"
  //     } else {
  //       return res.json({ status: "error", message: "no es posible cambiar el role del usuario" });
  //     }
  //     await userModel.updateOne({ _id: user._id }, user);
  //     res.send({ status: "success", message: "rol modificado" });
  //   } catch (error) {
  //     console.log(error.message);
  //     res.json({ status: "error", message: "hubo un error al cambiar el rol del usuario" })
  //   }
  // }

  static updateUser = async (req, res) => {
    try {
      const uid = req.body.uid;
      const newRole = req.body.role
      console.log(uid)
      console.log(newRole)
      const user = await userService.getUserById(uid)
      // console.log(user)

      if (newRole === user.role) {
        return res.status(404).send({ error: 'No se puede actualizar un usuario con un rol que ya poseia' });

      }



      user.role = newRole

      const result = await userService.updateUserById(uid, user);

      console.log(result)

      return res.status(200).send({ message: 'Usuario actualizado', result });
    } catch (error) {
      return res.status(500).send({ error: 'Error 500.Internal server error' });
    }
  }
}

export { UsersController }
